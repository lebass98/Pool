import React, { useMemo, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ScaleFn, useScale } from '@/constants/layout';
import { RegisteredPlayer } from '@/types/scoreboard.types';

interface GameSettingsModalProps {
  visible: boolean;
  currentPlayerCount: number;
  registeredPlayers: RegisteredPlayer[];
  onClose: () => void;
  onAddPlayer: (name: string, targetScore: number) => void;
  onDeletePlayer: (id: string) => void;
  onSaveSettings: (
    playerCount: number,
    selectedPlayerIds: string[]
  ) => void;
}

export const GameSettingsModal: React.FC<GameSettingsModalProps> = ({
  visible,
  currentPlayerCount: initialCount,
  registeredPlayers,
  onClose,
  onAddPlayer,
  onDeletePlayer,
  onSaveSettings,
}) => {
  const { s, f, line } = useScale();
  const styles = useMemo(() => createStyles(s, f, line), [s, f, line]);

  const [playerCount, setPlayerCount] = useState<number>(initialCount);
  const [newName, setNewName] = useState('');
  const [newTarget, setNewTarget] = useState('20');
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>(() =>
    registeredPlayers.slice(0, initialCount).map((p) => p.id)
  );

  const handleAdd = () => {
    onAddPlayer(newName.trim(), parseInt(newTarget, 10) || 20);
    setNewName('');
    setNewTarget('20');
  };

  const handleCountChange = (count: number) => {
    setPlayerCount(count);
    setSelectedPlayerIds((prev) => {
      if (prev.length >= count) {
        return prev.slice(0, count);
      }
      const currentIds = new Set(prev);
      const remaining = registeredPlayers.filter((p) => !currentIds.has(p.id));
      const fillCount = count - prev.length;
      return [...prev, ...remaining.slice(0, fillCount).map((p) => p.id)];
    });
  };

  const toggleSelectPlayer = (id: string) => {
    setSelectedPlayerIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= playerCount) {
        return [...prev.slice(1), id];
      }
      return [...prev, id];
    });
  };

  const handleSave = () => {
    if (selectedPlayerIds.length < 2) return;
    onSaveSettings(playerCount, selectedPlayerIds);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.modalCard}>
          <View style={styles.headerRow}>
            <Text style={styles.modalTitle}>경기 설정 (인원 선택 및 선수 지정)</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollBody}
            nestedScrollEnabled
          >
            {/* 1. 경기 인원 수 선택 (2 ~ 8명 선택) */}
            <View style={styles.countSection}>
              <Text style={styles.fieldLabel}>경기 인원 선택 (2명 ~ 최대 8명)</Text>
              <View style={styles.countChipRow}>
                {[2, 3, 4, 5, 6, 7, 8].map((num) => {
                  const isActive = playerCount === num;
                  return (
                    <TouchableOpacity
                      key={num}
                      style={[styles.countChip, isActive && styles.activeCountChip]}
                      onPress={() => handleCountChange(num)}
                    >
                      <Text
                        style={[
                          styles.countChipText,
                          isActive && styles.activeCountChipText,
                        ]}
                      >
                        {num}인
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* 2. 신규 선수 등록 */}
            <View style={styles.addSection}>
              <Text style={styles.fieldLabel}>새 선수 명단 등록</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={[styles.input, styles.nameInput]}
                  value={newName}
                  onChangeText={setNewName}
                  placeholder="선수 이름 (예: 박당구)"
                  placeholderTextColor="#64748B"
                />
                <TextInput
                  style={[styles.input, styles.targetInput]}
                  value={newTarget}
                  onChangeText={setNewTarget}
                  keyboardType="numeric"
                  placeholder="핸디"
                  placeholderTextColor="#64748B"
                />
                <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
                  <Text style={styles.addBtnText}>등록</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 3. 등록된 선수 목록 (N명 선택) */}
            <Text style={styles.fieldLabel}>
              출전 선수 선택 (현재 {selectedPlayerIds.length}/{playerCount}명 선택됨)
            </Text>

            <View style={styles.listContainer}>
              {registeredPlayers.map((item) => {
                const selectedIndex = selectedPlayerIds.indexOf(item.id);
                const isSelected = selectedIndex !== -1;

                return (
                  <View key={item.id} style={styles.playerItem}>
                    <View style={styles.playerInfo}>
                      <Text style={styles.playerName}>{item.name}</Text>
                      <Text style={styles.playerTarget}>목표 {item.targetScore}점</Text>
                    </View>

                    <View style={styles.actionGroup}>
                      <TouchableOpacity
                        style={[styles.selectChip, isSelected && styles.activeSelectChip]}
                        onPress={() => toggleSelectPlayer(item.id)}
                      >
                        <Text
                          style={[
                            styles.chipText,
                            isSelected && styles.activeSelectChipText,
                          ]}
                        >
                          {isSelected ? `${selectedIndex + 1}번 선수` : '선택'}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.deleteBtn}
                        onPress={() => onDeletePlayer(item.id)}
                      >
                        <Text style={styles.deleteBtnText}>삭제</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          </ScrollView>

          {/* 하단 저장 버튼 */}
          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.saveBtn,
                selectedPlayerIds.length < 2 && styles.disabledSaveBtn,
              ]}
              onPress={handleSave}
              disabled={selectedPlayerIds.length < 2}
            >
              <Text style={styles.saveBtnText}>설정 완료 및 경기 적용</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

/** 스타일 수치는 모두 1920 x 1080 기준 픽셀값 */
const createStyles = (s: ScaleFn, f: ScaleFn, line: ScaleFn) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: s(16),
    },
    modalCard: {
      width: '100%',
      maxWidth: s(560),
      maxHeight: '90%',
      backgroundColor: '#1E293B',
      borderRadius: s(20),
      padding: s(20),
      borderWidth: line(1),
      borderColor: '#334155',
    },
    scrollBody: {
      paddingBottom: s(8),
    },
    listContainer: {
      maxHeight: s(180),
      marginVertical: s(4),
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: s(14),
    },
    modalTitle: {
      color: '#F8FAFC',
      fontSize: f(20),
      fontWeight: '800',
    },
    closeBtn: {
      padding: s(6),
    },
    closeBtnText: {
      color: '#94A3B8',
      fontSize: f(20),
      fontWeight: '700',
    },
    fieldLabel: {
      color: '#94A3B8',
      fontSize: f(13),
      fontWeight: '700',
      marginBottom: s(6),
    },
    countSection: {
      backgroundColor: '#0F172A',
      borderRadius: s(12),
      padding: s(10),
      marginBottom: s(10),
    },
    countChipRow: {
      flexDirection: 'row',
      gap: s(4),
    },
    countChip: {
      flex: 1,
      backgroundColor: '#1E293B',
      paddingVertical: s(9),
      borderRadius: s(10),
      alignItems: 'center',
      borderWidth: line(1),
      borderColor: '#334155',
    },
    activeCountChip: {
      backgroundColor: '#03DAC6',
      borderColor: '#03DAC6',
    },
    countChipText: {
      color: '#94A3B8',
      fontSize: f(13),
      fontWeight: '700',
    },
    activeCountChipText: {
      color: '#000000',
      fontWeight: '800',
    },
    addSection: {
      backgroundColor: '#0F172A',
      borderRadius: s(12),
      padding: s(10),
      marginBottom: s(10),
    },
    inputRow: {
      flexDirection: 'row',
      gap: s(8),
    },
    nameInput: {
      flex: 1,
    },
    targetInput: {
      width: s(76),
      textAlign: 'center',
    },
    input: {
      backgroundColor: '#1E293B',
      borderColor: '#334155',
      borderWidth: line(1),
      borderRadius: s(10),
      paddingHorizontal: s(12),
      paddingVertical: s(9),
      color: '#F8FAFC',
      fontSize: f(14),
    },
    addBtn: {
      backgroundColor: '#03DAC6',
      borderRadius: s(10),
      paddingHorizontal: s(16),
      justifyContent: 'center',
      alignItems: 'center',
    },
    addBtnText: {
      color: '#000000',
      fontWeight: '800',
      fontSize: f(14),
    },
    list: {
      maxHeight: s(200),
      marginVertical: s(4),
    },
    playerItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#0F172A',
      paddingHorizontal: s(12),
      paddingVertical: s(8),
      borderRadius: s(10),
      marginBottom: s(6),
    },
    playerInfo: {
      flex: 1,
    },
    playerName: {
      color: '#F8FAFC',
      fontSize: f(15),
      fontWeight: '700',
    },
    playerTarget: {
      color: '#80DEEA',
      fontSize: f(12),
      fontWeight: '600',
      marginTop: s(1),
    },
    actionGroup: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: s(6),
    },
    selectChip: {
      backgroundColor: '#334155',
      paddingHorizontal: s(12),
      paddingVertical: s(6),
      borderRadius: s(8),
    },
    activeSelectChip: {
      backgroundColor: '#3B82F6',
    },
    chipText: {
      color: '#94A3B8',
      fontSize: f(12),
      fontWeight: '700',
    },
    activeSelectChipText: {
      color: '#FFFFFF',
    },
    deleteBtn: {
      paddingHorizontal: s(8),
      paddingVertical: s(4),
      backgroundColor: '#DC2626',
      borderRadius: s(6),
      marginLeft: s(4),
    },
    deleteBtnText: {
      color: '#FFFFFF',
      fontSize: f(12),
      fontWeight: '700',
    },
    btnRow: {
      flexDirection: 'row',
      gap: s(8),
      marginTop: s(10),
    },
    cancelBtn: {
      flex: 1,
      backgroundColor: '#334155',
      borderRadius: s(12),
      paddingVertical: s(13),
      alignItems: 'center',
    },
    saveBtn: {
      flex: 2,
      backgroundColor: '#03DAC6',
      borderRadius: s(12),
      paddingVertical: s(13),
      alignItems: 'center',
    },
    disabledSaveBtn: {
      backgroundColor: '#334155',
      opacity: 0.6,
    },
    cancelBtnText: {
      color: '#94A3B8',
      fontWeight: '700',
      fontSize: f(15),
    },
    saveBtnText: {
      color: '#000000',
      fontWeight: '800',
      fontSize: f(15),
    },
  });

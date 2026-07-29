import React, { useState } from 'react';
import {
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
import { RegisteredPlayer } from '@/types/scoreboard.types';

interface PlayerManagementModalProps {
  visible: boolean;
  registeredPlayers: RegisteredPlayer[];
  currentPlayerCount: number;
  onClose: () => void;
  onAddPlayer: (name: string, targetScore: number) => void;
  onDeletePlayer: (id: string) => void;
  onSelectPlayers: (selectedPlayerIds: string[]) => void;
}

export const PlayerManagementModal: React.FC<PlayerManagementModalProps> = ({
  visible,
  registeredPlayers,
  currentPlayerCount: initialCount,
  onClose,
  onAddPlayer,
  onDeletePlayer,
  onSelectPlayers,
}) => {
  const [newName, setNewName] = useState('');
  const [newTarget, setNewTarget] = useState('20');
  const [playerCount, setPlayerCount] = useState<number>(initialCount);
  // 선택된 선수 ID 목록 (1번부터 N번 선수까지)
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>(() =>
    registeredPlayers.slice(0, initialCount).map((p) => p.id)
  );

  const handleAdd = () => {
    if (!newName.trim()) return;
    onAddPlayer(newName.trim(), parseInt(newTarget, 10) || 20);
    setNewName('');
    setNewTarget('20');
  };

  const handleCountChange = (count: number) => {
    setPlayerCount(count);
    // 선택된 아이디 수 조정
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
        return [...prev.slice(1), id]; // 순환 선택
      }
      return [...prev, id];
    });
  };

  const handleApplyMatch = () => {
    if (selectedPlayerIds.length < 2) return;
    onSelectPlayers(selectedPlayerIds);
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
            <Text style={styles.modalTitle}>👥 당구장 선수 & 인원 설정</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollBody}
            nestedScrollEnabled
          >
            {/* 1. 게임 인원 수 선택 (2 ~ 6명) */}
            <View style={styles.countSection}>
              <Text style={styles.sectionLabel}>🕹️ 경기 인원 선택 (2 ~ 6명)</Text>
              <View style={styles.countChipRow}>
                {[2, 3, 4, 5, 6].map((num) => {
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
                        {num}인 경기
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* 2. 신규 선수 등록 폼 */}
            <View style={styles.addSection}>
              <Text style={styles.sectionLabel}>➕ 새 선수 등록</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={[styles.input, styles.nameInput]}
                  value={newName}
                  onChangeText={setNewName}
                  placeholder="선수 이름 (예: 홍길동)"
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

            {/* 3. 등록된 선수 목록 (N명 클릭 선택) */}
            <Text style={styles.sectionLabel}>
              📋 등록된 선수 목록 (현재 {selectedPlayerIds.length}/{playerCount}명 선택됨)
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
                          {isSelected ? `✓ ${selectedIndex + 1}번 선수` : '선택'}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.deleteBtn}
                        onPress={() => onDeletePlayer(item.id)}
                      >
                        <Text style={styles.deleteBtnText}>🗑️</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          </ScrollView>

          {/* 경기 출전 적용 버튼 */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.applyBtn,
                selectedPlayerIds.length < 2 && styles.disabledApplyBtn,
              ]}
              onPress={handleApplyMatch}
              disabled={selectedPlayerIds.length < 2}
            >
              <Text style={styles.applyBtnText}>
                {selectedPlayerIds.length >= 2
                  ? `🎯 선택한 ${selectedPlayerIds.length}명으로 ${playerCount}인 경기 시작`
                  : `경기에 참여할 선수를 2명 이상 선택해 주세요`}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 540,
    maxHeight: '90%',
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  scrollBody: {
    paddingBottom: 8,
  },
  listContainer: {
    maxHeight: 180,
    marginVertical: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    color: '#F8FAFC',
    fontSize: 20,
    fontWeight: '800',
  },
  closeBtn: {
    padding: 6,
  },
  closeBtnText: {
    color: '#94A3B8',
    fontSize: 20,
    fontWeight: '700',
  },
  countSection: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
  countChipRow: {
    flexDirection: 'row',
    gap: 6,
  },
  countChip: {
    flex: 1,
    backgroundColor: '#1E293B',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  activeCountChip: {
    backgroundColor: '#03DAC6',
    borderColor: '#03DAC6',
  },
  countChipText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '700',
  },
  activeCountChipText: {
    color: '#000000',
    fontWeight: '800',
  },
  addSection: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
  sectionLabel: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  nameInput: {
    flex: 1,
  },
  targetInput: {
    width: 76,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#F8FAFC',
    fontSize: 14,
  },
  addBtn: {
    backgroundColor: '#03DAC6',
    borderRadius: 10,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtnText: {
    color: '#000000',
    fontWeight: '800',
    fontSize: 14,
  },
  list: {
    maxHeight: 200,
    marginVertical: 4,
  },
  playerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 6,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
  },
  playerTarget: {
    color: '#80DEEA',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 1,
  },
  actionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  selectChip: {
    backgroundColor: '#334155',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  activeSelectChip: {
    backgroundColor: '#3B82F6',
  },
  chipText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '700',
  },
  activeSelectChipText: {
    color: '#FFFFFF',
  },
  deleteBtn: {
    padding: 6,
    marginLeft: 4,
  },
  deleteBtnText: {
    fontSize: 15,
  },
  footer: {
    marginTop: 10,
  },
  applyBtn: {
    backgroundColor: '#03DAC6',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  disabledApplyBtn: {
    backgroundColor: '#334155',
    opacity: 0.6,
  },
  applyBtnText: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '800',
  },
});

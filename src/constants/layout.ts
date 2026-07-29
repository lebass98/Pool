import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

/**
 * 디자인 기준 해상도 (가로 모드 FHD)
 * 모든 스타일 수치는 1920 x 1080 화면에서의 픽셀값으로 작성하고,
 * 실제 화면 크기에 맞춰 스케일링한다.
 */
export const BASE_WIDTH = 1920;
export const BASE_HEIGHT = 1080;

/** 지나친 축소/확대를 막는 레이아웃 스케일 범위 */
const MIN_SCALE = 0.34;
const MAX_SCALE = 1.6;

/**
 * 작은 글자가 화면 축소를 따라가는 비율 (1 = 레이아웃과 완전 동일 비율).
 *
 * 레이아웃이 0.67배로 줄 때 글자도 0.67배가 되면 태블릿에서 라벨이 읽기
 * 어려워진다. 작은 글자는 축소를 절반만 따라가게 해 가독성을 지킨다.
 */
const SMALL_TEXT_FOLLOW = 0.35;

/** 축소 시 이 크기 아래로는 줄이지 않는다 (가독성 하한선) */
const MIN_FONT_SIZE = 13;

/**
 * 완화를 적용할 폰트 크기 구간.
 *
 * 작은 UI 텍스트(라벨/배지)는 축소에 가장 취약하므로 완화를 최대로 준다.
 * 반대로 큰 표시용 숫자(타이머, 플립 스코어)는 이미 충분히 크고, 완화하면
 * 좁아진 컨테이너를 넘치므로 화면 비율대로 그대로 줄인다.
 */
const SMALL_TEXT_MAX = 20;
const LARGE_TEXT_MIN = 40;

export type ScaleFn = (size: number) => number;

export const getScale = (width: number, height: number) => {
  const raw = Math.min(width / BASE_WIDTH, height / BASE_HEIGHT);
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, raw));
};

const round = (n: number) => Math.round(n * 100) / 100;

/**
 * 해당 폰트 크기가 화면 축소를 얼마나 따라갈지 (0 ~ 1).
 * 작은 글자는 덜 따라가고(가독성), 큰 글자는 그대로 따라간다(레이아웃 안정).
 */
const followRatio = (size: number) => {
  if (size <= SMALL_TEXT_MAX) return SMALL_TEXT_FOLLOW;
  if (size >= LARGE_TEXT_MIN) return 1;
  const t = (size - SMALL_TEXT_MAX) / (LARGE_TEXT_MIN - SMALL_TEXT_MAX);
  return SMALL_TEXT_FOLLOW + (1 - SMALL_TEXT_FOLLOW) * t;
};

/**
 * 1920 x 1080 기준 수치를 현재 화면 크기에 맞게 변환하는 스케일러.
 *
 * - `s(n)`: 여백/크기/반경 등 레이아웃 수치. 화면 비율대로 그대로 환산
 * - `f(n)`: 폰트 크기. 작은 글자는 축소를 덜 따라가고 최소 크기가 보장된다
 * - `line(n)`: 테두리/구분선처럼 1px 미만으로 줄면 사라지는 값 (최소 1px)
 */
export const useScale = () => {
  const { width, height } = useWindowDimensions();
  const scale = getScale(width, height);

  return useMemo(() => {
    const s: ScaleFn = (size) => round(size * scale);

    const f: ScaleFn = (size) => {
      const proportional = size * scale;
      // 기준 크기와 완전 비례 크기 사이를 따라가는 비율만큼 보간
      const eased = size + (proportional - size) * followRatio(size);
      // 확대 시에는 하한선이 개입하지 않도록 원래 크기와 비교해 낮은 값 사용
      const floor = Math.min(size, MIN_FONT_SIZE);
      return round(Math.max(floor, eased));
    };

    const line: ScaleFn = (size) => Math.max(1, s(size));
    const vs: ScaleFn = (size) => round(size * (height / BASE_HEIGHT));

    const isSmallHeight = height < 540;
    const isVerySmallHeight = height < 420;
    const isFoldRatio = width / height < 1.6;

    return { scale, s, f, line, vs, width, height, isSmallHeight, isVerySmallHeight, isFoldRatio };
  }, [scale, width, height]);
};

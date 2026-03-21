import React, { useRef, useEffect, useCallback, useState } from 'react';
import { View, TextInput, Pressable, Animated, GestureResponderEvent, LayoutChangeEvent } from 'react-native';
import { Text } from './Text';
import { Plus, Check, ArrowDown, Loader2 } from 'lucide-react-native';
import { BookItem } from '../types/book';
import { useBooks } from '../context/BooksContext';
import { theme } from '../theme/colors';

type BookItemRowProps = {
  item: BookItem;
  onPress: () => void;
  onPressIn?: (e: GestureResponderEvent) => void;
  onPressOut?: (e: GestureResponderEvent) => void;
};

export const BookItemRow = ({ item, onPress, onPressIn, onPressOut }: BookItemRowProps) => {
  const { updateBookText, lookupBook, markAsRead, setBookState } = useBooks();
  const inputRef = useRef<TextInput>(null);
  const spinValue = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleSlide = useRef(new Animated.Value(4)).current;
  const checkboxFill = useRef(new Animated.Value(item.state === 'READ' ? 1 : 0)).current;
  const checkmarkOpacity = useRef(new Animated.Value(item.state === 'READ' ? 1 : 0)).current;
  const checkboxPendingRef = useRef(false);
  const rowHeightAnim = useRef(new Animated.Value(0)).current;
  const rowContentOpacity = useRef(new Animated.Value(1)).current;
  const naturalHeightRef = useRef(0);
  const rowCollapseActiveRef = useRef(false);
  const rowContentMeasureRef = useRef<View>(null);
  const [rowLayoutReady, setRowLayoutReady] = useState(false);

  useEffect(() => {
    if (item.state === 'EMPTY') {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [item.state]);

  useEffect(() => {
    if (item.state === 'SEARCHING') {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        })
      ).start();
    } else {
      spinValue.stopAnimation();
      spinValue.setValue(0);
    }
  }, [item.state]);

  useEffect(() => {
    if (item.state === 'UNSEARCHED') {
      subtitleOpacity.setValue(0);
      subtitleSlide.setValue(4);
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(subtitleOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(subtitleSlide, { toValue: 0, duration: 250, useNativeDriver: true }),
        ]).start();
      }, 50);
    } else {
      subtitleOpacity.setValue(0);
      subtitleSlide.setValue(4);
    }
  }, [item.state]);

  useEffect(() => {
    setRowLayoutReady(false);
    naturalHeightRef.current = 0;
    rowHeightAnim.setValue(0);
    rowContentOpacity.stopAnimation();
    rowContentOpacity.setValue(1);
  }, [item.id, rowHeightAnim, rowContentOpacity]);

  useEffect(() => {
    checkboxPendingRef.current = false;
    const checked = item.state === 'READ';
    const v = checked ? 1 : 0;
    checkboxFill.stopAnimation();
    checkmarkOpacity.stopAnimation();
    checkboxFill.setValue(v);
    checkmarkOpacity.setValue(v);
    rowCollapseActiveRef.current = false;
    rowHeightAnim.stopAnimation();
    rowContentOpacity.stopAnimation();
    rowContentOpacity.setValue(1);
    const h = naturalHeightRef.current;
    if (h > 0) {
      rowHeightAnim.setValue(h);
    } else {
      setRowLayoutReady(false);
      rowHeightAnim.setValue(0);
    }
  }, [item.id, item.state, rowHeightAnim, rowContentOpacity]);

  useEffect(() => {
    return () => {
      rowHeightAnim.stopAnimation();
      rowContentOpacity.stopAnimation();
    };
  }, [rowHeightAnim, rowContentOpacity]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const onRowContentLayout = useCallback(
    (e: LayoutChangeEvent) => {
      if (rowCollapseActiveRef.current) return;

      const h = e.nativeEvent.layout.height;
      if (h > 0) {
        naturalHeightRef.current = h;
      }

      if (!rowLayoutReady) {
        const targetH = h > 0 ? h : naturalHeightRef.current;
        if (targetH > 0) {
          rowHeightAnim.setValue(targetH);
          setRowLayoutReady(true);
        }
        return;
      }

      if (h > 0) {
        rowHeightAnim.setValue(h);
      }
    },
    [rowHeightAnim, rowLayoutReady]
  );

  const handleCheckbox = useCallback(() => {
    if (checkboxPendingRef.current) return;

    const runRowCollapseThen = (onComplete: () => void) => {
      const fadeMs = 220;
      const heightMs = 200;
      const heightDelayMs = 70;
      const fallbackRowH = 56;

      const startCollapse = (fromH: number) => {
        naturalHeightRef.current = Math.max(naturalHeightRef.current, fromH);
        rowCollapseActiveRef.current = true;
        rowHeightAnim.setValue(fromH);
        rowContentOpacity.setValue(1);
        Animated.parallel([
          Animated.timing(rowContentOpacity, {
            toValue: 0,
            duration: fadeMs,
            useNativeDriver: false,
          }),
          Animated.sequence([
            Animated.delay(heightDelayMs),
            Animated.timing(rowHeightAnim, {
              toValue: 0,
              duration: heightMs,
              useNativeDriver: false,
            }),
          ]),
        ]).start(({ finished: collapseFinished }) => {
          rowCollapseActiveRef.current = false;
          if (!collapseFinished) {
            checkboxPendingRef.current = false;
            rowHeightAnim.setValue(fromH);
            rowContentOpacity.setValue(1);
            return;
          }
          onComplete();
        });
      };

      const beginWithHeight = (h: number) => {
        const fromH = h > 0 ? h : fallbackRowH;
        setRowLayoutReady(true);
        startCollapse(fromH);
      };

      if (naturalHeightRef.current > 0) {
        beginWithHeight(naturalHeightRef.current);
        return;
      }

      const node = rowContentMeasureRef.current;
      const runMeasure = () => {
        if (!node?.measure) {
          beginWithHeight(fallbackRowH);
          return;
        }
        node.measure((_x, _y, _w, measuredH, _pageX, _pageY) => {
          if (measuredH > 0) {
            beginWithHeight(measuredH);
            return;
          }
          requestAnimationFrame(() => {
            node.measure((_x2, _y2, _w2, measuredH2) => {
              beginWithHeight(measuredH2 > 0 ? measuredH2 : fallbackRowH);
            });
          });
        });
      };
      requestAnimationFrame(runMeasure);
    };

    if (item.state === 'FOUND') {
      checkboxPendingRef.current = true;
      Animated.parallel([
        Animated.timing(checkboxFill, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(checkmarkOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start(({ finished }) => {
        if (!finished) {
          checkboxPendingRef.current = false;
          return;
        }
        runRowCollapseThen(() => markAsRead(item.id));
      });
    } else if (item.state === 'READ') {
      checkboxPendingRef.current = true;
      Animated.parallel([
        Animated.timing(checkboxFill, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(checkmarkOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start(({ finished }) => {
        if (!finished) {
          checkboxPendingRef.current = false;
          return;
        }
        runRowCollapseThen(() => setBookState(item.id, 'FOUND'));
      });
    }
  }, [item.id, item.state, checkboxFill, checkmarkOpacity, markAsRead, setBookState, rowHeightAnim, rowContentOpacity]);

  const checkboxBorderOpacity = checkboxFill.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const renderContent = () => {
    switch (item.state) {
      case 'EMPTY':
      case 'ACTIVE':
        return (
          <View className="flex-1">
            <TextInput
              ref={inputRef}
              className="text-foreground"
              style={{ fontFamily: 'WorkSans_500Medium', fontSize: 17, paddingTop: 8, paddingBottom: 10 }}
              placeholder="Enter book title..."
              placeholderTextColor={theme.muted}
              value={item.originalText}
              onChangeText={(text) => updateBookText(item.id, text)}
              onSubmitEditing={() => lookupBook(item.id)}
              returnKeyType="done"
            />
          </View>
        );

      case 'UNSEARCHED':
        return (
          <View className="flex-1">
            <Text className="text-base text-foreground">
              {item.originalText}
            </Text>
            <Animated.View style={{ opacity: subtitleOpacity, transform: [{ translateY: subtitleSlide }] }}>
              <Text className="text-xs text-subtle mt-0.5">
                Not looked up yet
              </Text>
            </Animated.View>
          </View>
        );

      case 'SEARCHING':
        return (
          <View className="flex-1">
            <Text className="text-base text-muted">
              {item.originalText}
            </Text>
            <Text className="text-xs text-subtle mt-0.5">
              Searching...
            </Text>
          </View>
        );

      case 'FOUND':
        return (
          <Pressable className="flex-1" onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut}>
            <Text className="text-base text-foreground font-medium">
              {item.resolvedTitle}
            </Text>
            <Text className="text-sm text-muted mt-0.5">
              {item.resolvedAuthor}
            </Text>
          </Pressable>
        );

      case 'OPTIONS_FOUND':
        return (
          <Pressable className="flex-1" onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut}>
            <Text className="text-base text-foreground">
              {item.originalText}
            </Text>
            <Text className="text-sm text-primary mt-0.5">
              Multiple matches found · Tap to choose
            </Text>
          </Pressable>
        );

      case 'NOT_FOUND':
        return (
          <Pressable className="flex-1" onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut}>
            <Text className="text-base text-foreground">
              {item.originalText}
            </Text>
            <Text className="text-sm text-danger mt-0.5">
              No matches found · Tap to retry
            </Text>
          </Pressable>
        );

      case 'READ':
        return (
          <Pressable className="flex-1" onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut}>
            <Text className="text-base text-foreground line-through">
              {item.resolvedTitle}
            </Text>
            <Text className="text-sm text-subtle mt-0.5">
              {item.resolvedAuthor}
            </Text>
          </Pressable>
        );

      default:
        return null;
    }
  };

  const showCheckbox = item.state === 'FOUND' || item.state === 'READ';
  const showQuestion = item.state === 'OPTIONS_FOUND';
  const showNotFound = item.state === 'NOT_FOUND';
  const showPlus = item.state === 'EMPTY' || item.state === 'ACTIVE';
  const showArrow = item.state === 'UNSEARCHED';
  const showLoader = item.state === 'SEARCHING';

  const iconColor = theme.subtle;

  return (
    <Animated.View
      style={
        rowLayoutReady
          ? { height: rowHeightAnim, overflow: 'hidden' }
          : { overflow: 'hidden' }
      }
    >
      <View
        ref={rowContentMeasureRef}
        className="px-4 py-1.5"
        collapsable={false}
        onLayout={onRowContentLayout}
      >
        <Animated.View className="flex-row items-center" style={{ opacity: rowContentOpacity }}>
          {showPlus && (
            <View className="w-7 h-7 mr-3 items-center justify-center">
              <Plus size={22} color={iconColor} />
            </View>
          )}
          {showArrow && (
            <View className="w-7 h-7 mr-3 items-center justify-center">
              <ArrowDown size={22} color={iconColor} />
            </View>
          )}
          {showLoader && (
            <Animated.View className="w-7 h-7 mr-3 items-center justify-center" style={{ transform: [{ rotate: spin }] }}>
              <Loader2 size={26} color={iconColor} />
            </Animated.View>
          )}
          {showCheckbox && (
            <Pressable onPress={handleCheckbox} onPressIn={onPressIn} onPressOut={onPressOut} className="mr-3">
              <View
                className="w-7 h-7 rounded-full items-center justify-center overflow-hidden"
                style={{ position: 'relative' }}
              >
                <Animated.View
                  pointerEvents="none"
                  style={{
                    position: 'absolute',
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    borderWidth: 3.5,
                    borderColor: theme.muted,
                    opacity: checkboxBorderOpacity,
                  }}
                />
                <Animated.View
                  pointerEvents="none"
                  style={{
                    position: 'absolute',
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: theme.foreground,
                    opacity: checkboxFill,
                  }}
                />
                <Animated.View pointerEvents="none" style={{ opacity: checkmarkOpacity }}>
                  <Check size={16} color={theme.background} strokeWidth={4} />
                </Animated.View>
              </View>
            </Pressable>
          )}
          {showQuestion && (
            <View
              className="w-7 h-7 rounded-full mr-3 items-center justify-center"
              style={{ borderWidth: 2.5, borderColor: '#37AE63' }}
            >
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#37AE63' }}>?</Text>
            </View>
          )}
          {showNotFound && (
            <View
              className="w-7 h-7 rounded-full mr-3 items-center justify-center"
              style={{ borderWidth: 2.5, borderColor: theme.danger }}
            >
              <Text style={{ fontSize: 14, fontWeight: '700', color: theme.danger }}>!</Text>
            </View>
          )}
          {renderContent()}
        </Animated.View>
      </View>
    </Animated.View>
  );
};

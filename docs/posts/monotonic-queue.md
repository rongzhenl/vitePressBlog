---
title: 单调队列：用 O(1) 时间解决滑动窗口最大值问题
date: 2026-03-22
tags: [算法, 数据结构, 滑动窗口, 单调队列]
description: 深入理解单调队列的设计思路与实现，掌握滑动窗口最大值问题的线性时间解法。
---

# 单调队列：用 O(1) 时间解决滑动窗口最大值问题

> 原文参考：[labuladong - 单调队列结构解决滑动窗口问题](https://labuladong.online/zh/algo/data-structure/monotonic-queue/)

## 为什么需要单调队列

先看一个场景：给定一个窗口 `window`，已知其最大值为 `A`。

- **加入元素 B**：直接比较 A 和 B，O(1) 得到新最大值，没问题。
- **移出元素**：如果移出的恰好是最大值 A，就必须重新遍历窗口所有元素才能找到新最大值，退化为 O(N)。

这就是滑动窗口求最值的核心难点——**元素的移出会破坏已知的最值信息**。

你可能会想到用优先级队列（堆）来维护最值，堆确实能 O(1) 取最大值，但它按元素大小出队，**不满足队列「先进先出」的时间顺序**，无法正确模拟滑动窗口的移出行为。

因此需要一种新结构：**既保持先进先出的时间顺序，又能 O(1) 获取当前最值**，这就是「单调队列」。

## 问题描述

LeetCode 239 · 滑动窗口最大值：给定数组 `nums` 和窗口大小 `k`，窗口从左向右滑动，输出每个位置窗口内的最大值。

```
输入：nums = [1,3,-1,-3,5,3,6,7], k = 3
输出：[3,3,5,5,6,7]

滑动窗口的位置        最大值
[1  3  -1] -3  5  3  6  7    3
 1 [3  -1  -3] 5  3  6  7    3
 1  3 [-1  -3  5] 3  6  7    5
 1  3  -1 [-3  5  3] 6  7    5
 1  3  -1  -3 [5  3  6] 7    6
 1  3  -1  -3  5 [3  6  7]   7
```

## 单调队列的 API 设计

与普通队列相比，单调队列的 API 有所不同：

```java
// 普通队列
class Queue {
    void push(int n);  // 队尾入队
    void pop();        // 队头出队
}

// 单调队列
class MonotonicQueue {
    void push(int n);  // 队尾入队（维护单调性）
    int  max();        // O(1) 返回队列最大值
    void pop(int n);   // 若队头是 n，则移除
}
```

## 核心实现

单调队列底层使用**双端链表**（支持头尾快速增删）。

### push：入队时维护单调递减

```java
public void push(int n) {
    // 把队尾所有比 n 小的元素弹出
    while (!maxq.isEmpty() && maxq.getLast() < n) {
        maxq.pollLast();
    }
    maxq.addLast(n);
}
```

可以把每个元素的大小想象成体重：**体重大的人入队时，会把前面所有比自己轻的人"压扁"**，直到遇到更重的才停下。这样队列中的元素始终保持**从头到尾单调递减**。

### max：O(1) 取最大值

```java
public int max() {
    return maxq.getFirst();  // 队头就是最大值
}
```

### pop：移出队头元素

```java
public void pop(int n) {
    if (n == maxq.getFirst()) {
        maxq.pollFirst();
    }
}
```

注意：`pop` 需要判断队头是否等于 `n`，因为 `n` 可能在之前的 `push` 过程中已经被"压扁"移除了，此时不需要再做任何操作。

## 完整解题代码（Java）

```java
class Solution {

    class MonotonicQueue {
        LinkedList<Integer> q = new LinkedList<>();

        public void push(int n) {
            while (!q.isEmpty() && q.getLast() < n) {
                q.pollLast();
            }
            q.addLast(n);
        }

        public int max() {
            return q.getFirst();
        }

        public void pop(int n) {
            if (n == q.getFirst()) {
                q.pollFirst();
            }
        }
    }

    public int[] maxSlidingWindow(int[] nums, int k) {
        MonotonicQueue window = new MonotonicQueue();
        List<Integer> res = new ArrayList<>();

        for (int i = 0; i < nums.length; i++) {
            if (i < k - 1) {
                // 先填满窗口前 k-1 个位置
                window.push(nums[i]);
            } else {
                // 窗口滑动：入新元素 → 记录最大值 → 出旧元素
                window.push(nums[i]);
                res.add(window.max());
                window.pop(nums[i - k + 1]);
            }
        }

        int[] arr = new int[res.size()];
        for (int i = 0; i < res.size(); i++) {
            arr[i] = res.get(i);
        }
        return arr;
    }
}
```

## 复杂度分析

**时间复杂度：O(N)**

`push` 方法内有 while 循环，单次最坏是 O(N)，但用**摊还分析**来看：`nums` 中每个元素最多被加入和移出 `window` 各一次，整体操作总次数不超过 2N，因此均摊时间复杂度是 O(1)，整体算法是 **O(N)**。

**空间复杂度：O(k)**

单调队列中最多同时存放 k 个元素。

## 关键思路总结

单调队列的精髓在于 `push` 时的**主动淘汰**：把队尾所有比新元素小的元素提前删除。这些被删除的元素有一个共同特点——它们比新元素更早入队，也更早出队，而且值还更小，**在它们存活的整个生命周期内都不可能成为最大值**，因此可以安全地提前丢弃。

这种"用空间换时间、用预处理换查询效率"的思路，是很多高效数据结构的共同设计哲学。

## 拓展思考

1. 如何在 O(1) 时间同时支持 `max()` 和 `min()`？（提示：维护两个方向的单调性）
2. 如何去掉 `pop(int n)` 中的参数，让 API 更符合标准队列规范？
3. 如何正确实现 `size()` 方法？（注意：底层链表的长度 ≠ 逻辑上的队列元素个数）

这三个问题的答案可以参考：[单调队列的通用实现及经典习题](https://labuladong.online/zh/algo/problem-set/monotonic-queue/)

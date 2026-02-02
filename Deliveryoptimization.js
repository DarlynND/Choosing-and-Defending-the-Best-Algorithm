// ============================================================================
// DELIVERY PLATFORM OPTIMIZATION: ACTIVITY SELECTION PROBLEM
// Comparative Analysis of Brute-Force vs. Greedy Algorithms
// ============================================================================

// ============================================================================
// 1. BRUTE-FORCE IMPLEMENTATION
// ============================================================================
// Explores all possible combinations of tasks to find the maximum set of
// non-overlapping tasks. Time Complexity: O(2^n)

function bruteForceSelection(tasks) {
  if (tasks.length === 0) return [];
  
  // Helper function to check if two tasks overlap
  function tasksOverlap(task1, task2) {
    return task1.start < task2.end && task2.start < task1.end;
  }
  
  // Helper function to check if a set of tasks has any overlaps
  function hasNoOverlaps(taskSet) {
    for (let i = 0; i < taskSet.length; i++) {
      for (let j = i + 1; j < taskSet.length; j++) {
        if (tasksOverlap(taskSet[i], taskSet[j])) {
          return false;
        }
      }
    }
    return true;
  }
  
  // Generate all possible subsets using bit manipulation
  const n = tasks.length;
  const totalSubsets = Math.pow(2, n);
  let maxSet = [];
  
  for (let i = 0; i < totalSubsets; i++) {
    const subset = [];
    for (let j = 0; j < n; j++) {
      if (i & (1 << j)) {
        subset.push(tasks[j]);
      }
    }
    
    // Check if this subset has no overlaps and is larger than current max
    if (hasNoOverlaps(subset) && subset.length > maxSet.length) {
      maxSet = subset;
    }
  }
  
  return maxSet;
}

// ============================================================================
// 2. GREEDY IMPLEMENTATION
// ============================================================================
// Selects tasks by always choosing the one that ends earliest among remaining
// compatible tasks. Time Complexity: O(n log n)

function greedySelection(tasks) {
  if (tasks.length === 0) return [];
  
  // Sort tasks by end time (earliest first)
  const sortedTasks = [...tasks].sort((a, b) => a.end - b.end);
  
  const selected = [sortedTasks[0]];
  let lastEndTime = sortedTasks[0].end;
  
  for (let i = 1; i < sortedTasks.length; i++) {
    // If current task starts after or when the last selected task ends
    if (sortedTasks[i].start >= lastEndTime) {
      selected.push(sortedTasks[i]);
      lastEndTime = sortedTasks[i].end;
    }
  }
  
  return selected;
}

// ============================================================================
// 3. UTILITY FUNCTIONS
// ============================================================================

// Generate random tasks for testing
function generateRandomTasks(count, maxTime = 1000) {
  const tasks = [];
  for (let i = 0; i < count; i++) {
    const start = Math.floor(Math.random() * maxTime);
    const duration = Math.floor(Math.random() * 50) + 1;
    tasks.push({ start, end: start + duration });
  }
  return tasks;
}

// Generate edge case test data
function generateEdgeCases() {
  return {
    allOverlapping: Array.from({ length: 100 }, (_, i) => ({
      start: 0,
      end: 100
    })),
    
    allNonOverlapping: Array.from({ length: 100 }, (_, i) => ({
      start: i * 10,
      end: i * 10 + 5
    })),
    
    sameStartTime: Array.from({ length: 100 }, (_, i) => ({
      start: 0,
      end: i + 1
    })),
    
    sameEndTime: Array.from({ length: 100 }, (_, i) => ({
      start: i,
      end: 100
    }))
  };
}

// Performance timer utility
function measurePerformance(fn, args, label) {
  const start = process.hrtime.bigint();
  const result = fn(...args);
  const end = process.hrtime.bigint();
  const duration = Number(end - start) / 1000000; // Convert to milliseconds
  
  console.log(`${label}: ${duration.toFixed(3)} ms`);
  return { result, duration };
}

// ============================================================================
// 4. VALIDATION AND TESTING
// ============================================================================

console.log('='.repeat(80));
console.log('DELIVERY PLATFORM OPTIMIZATION - ALGORITHM COMPARISON');
console.log('='.repeat(80));
console.log();

// Sample input from the assignment
const tasks = [
  { start: 1, end: 3 },
  { start: 2, end: 5 },
  { start: 4, end: 6 },
  { start: 6, end: 7 },
  { start: 5, end: 9 },
  { start: 8, end: 10 }
];

console.log('STEP 1: VALIDATE CORRECTNESS WITH SAMPLE INPUT');
console.log('-'.repeat(80));
console.log('Input tasks:', JSON.stringify(tasks));
console.log();

const bruteForceResult = bruteForceSelection(tasks);
const greedyResult = greedySelection(tasks);

console.log('Brute-Force Result:');
console.log('  Selected tasks:', JSON.stringify(bruteForceResult));
console.log('  Count:', bruteForceResult.length);
console.log();

console.log('Greedy Result:');
console.log('  Selected tasks:', JSON.stringify(greedyResult));
console.log('  Count:', greedyResult.length);
console.log();

console.log('✓ Both algorithms return the same count:', 
  bruteForceResult.length === greedyResult.length ? 'YES' : 'NO');
console.log();

// ============================================================================
// 5. PERFORMANCE COMPARISON WITH LARGE INPUT
// ============================================================================

console.log('='.repeat(80));
console.log('STEP 2: PERFORMANCE TESTING WITH LARGE INPUTS');
console.log('-'.repeat(80));
console.log();

// Test with progressively larger inputs
const testSizes = [10, 15, 20, 10000];

testSizes.forEach(size => {
  console.log(`Testing with ${size} tasks:`);
  console.log('-'.repeat(40));
  
  const largeTasks = generateRandomTasks(size);
  
  if (size <= 20) {
    // Only run brute-force for small inputs (it's exponential!)
    const bf = measurePerformance(
      bruteForceSelection,
      [largeTasks],
      '  Brute-Force'
    );
    console.log(`    Result: ${bf.result.length} tasks selected`);
  } else {
    console.log('  Brute-Force: SKIPPED (would take too long - O(2^n) complexity)');
  }
  
  const greedy = measurePerformance(
    greedySelection,
    [largeTasks],
    '  Greedy     '
  );
  console.log(`    Result: ${greedy.result.length} tasks selected`);
  console.log();
});

// ============================================================================
// 6. EDGE CASE TESTING (BONUS)
// ============================================================================

console.log('='.repeat(80));
console.log('BONUS: EDGE CASE STRESS TESTING');
console.log('-'.repeat(80));
console.log();

const edgeCases = generateEdgeCases();

Object.entries(edgeCases).forEach(([caseName, caseData]) => {
  console.log(`Edge Case: ${caseName}`);
  console.log('-'.repeat(40));
  
  const greedy = measurePerformance(
    greedySelection,
    [caseData],
    '  Greedy'
  );
  console.log(`    Tasks selected: ${greedy.result.length} out of ${caseData.length}`);
  console.log();
});

// ============================================================================
// 7. MEMORY USAGE ANALYSIS
// ============================================================================

console.log('='.repeat(80));
console.log('MEMORY USAGE ANALYSIS');
console.log('-'.repeat(80));
console.log();

const testTasks = generateRandomTasks(1000);

console.log('Brute-Force Memory Characteristics:');
console.log('  - Generates 2^n subsets in worst case');
console.log('  - For 1000 tasks: 2^1000 subsets (IMPOSSIBLE)');
console.log('  - Practical limit: ~20-25 tasks');
console.log('  - Space Complexity: O(n * 2^n) for storing subsets');
console.log();

console.log('Greedy Memory Characteristics:');
console.log('  - Creates one sorted copy of input: O(n)');
console.log('  - Stores only selected tasks: O(n) worst case');
console.log('  - Space Complexity: O(n)');
console.log('  - Can handle millions of tasks efficiently');
console.log();

// ============================================================================
// 8. FINAL SUMMARY AND RECOMMENDATION
// ============================================================================

console.log('='.repeat(80));
console.log('FINAL ANALYSIS AND RECOMMENDATION');
console.log('='.repeat(80));
console.log();

console.log('TIME COMPLEXITY COMPARISON:');
console.log('  Brute-Force: O(2^n) - Exponential');
console.log('  Greedy:      O(n log n) - Log-linear (dominated by sorting)');
console.log();

console.log('SPACE COMPLEXITY COMPARISON:');
console.log('  Brute-Force: O(n * 2^n) - Exponential space for subsets');
console.log('  Greedy:      O(n) - Linear space for sorting');
console.log();

console.log('SCALABILITY:');
console.log('  Brute-Force: Fails beyond ~20-25 tasks');
console.log('  Greedy:      Easily handles 10,000+ tasks');
console.log();

console.log('MAINTAINABILITY:');
console.log('  Brute-Force: Complex logic, hard to optimize');
console.log('  Greedy:      Simple, clear, easy to understand and modify');
console.log();

console.log('CORRECTNESS:');
console.log('  Both algorithms produce OPTIMAL solutions for this problem.');
console.log('  The greedy approach is PROVEN optimal for activity selection.');
console.log();

console.log('='.repeat(80));
console.log('RECOMMENDATION: GREEDY ALGORITHM');
console.log('='.repeat(80));
console.log();
console.log('JUSTIFICATION:');
console.log('1. Performance: O(n log n) vs O(2^n) - greedy is exponentially faster');
console.log('2. Scalability: Handles thousands of tasks per second as required');
console.log('3. Memory: O(n) space - efficient for real-time systems');
console.log('4. Correctness: Mathematically proven to find optimal solution');
console.log('5. Maintainability: Simple code, easy to debug and extend');
console.log();
console.log('WHEN TO USE BRUTE-FORCE:');
console.log('- Educational purposes to understand the problem');
console.log('- Verification of greedy algorithm on small test cases');
console.log('- Problems where greedy approach is NOT proven optimal');
console.log('- Very small datasets (<15 items) where performance doesn\'t matter');
console.log();
console.log('='.repeat(80));

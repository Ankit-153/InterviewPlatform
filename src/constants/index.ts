import { Clock, Code2, Calendar, Users } from "lucide-react";

export const INTERVIEW_CATEGORY = [
  { id: "upcoming", title: "Upcoming Interviews", variant: "outline" },
  { id: "completed", title: "Completed", variant: "secondary" },
  { id: "succeeded", title: "Succeeded", variant: "default" },
  { id: "failed", title: "Failed", variant: "destructive" },
] as const;

export const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00",
  "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "00:00",
];

export const QUICK_ACTIONS = [
  {
    icon: Code2,
    title: "New Call",
    description: "Start an instant call",
    color: "primary",
    gradient: "from-primary/10 via-primary/5 to-transparent",
  },
  {
    icon: Users,
    title: "Join Interview",
    description: "Enter via invitation link",
    color: "purple-500",
    gradient: "from-purple-500/10 via-purple-500/5 to-transparent",
  },
  {
    icon: Calendar,
    title: "Schedule",
    description: "Plan upcoming interviews",
    color: "blue-500",
    gradient: "from-blue-500/10 via-blue-500/5 to-transparent",
  },
  {
    icon: Clock,
    title: "Recordings",
    description: "Access past interviews",
    color: "orange-500",
    gradient: "from-orange-500/10 via-orange-500/5 to-transparent",
  },
];

export const LANGUAGES = [
  { id: "javascript", name: "JavaScript", icon: "/javascript.png" },
  { id: "python", name: "Python", icon: "/python.png" },
  { id: "java", name: "Java", icon: "/java.png" },
  { id: "cpp", name: "Cpp", icon: "/cpp.png" },
] as const;

export const CODING_QUESTIONS: CodeQuestion[] = [
  {
    id: "two-sum",
    title: "Two Sum",
    description:
      "Given an array of integers `nums` and an integer `target`, return indices of the two numbers in the array such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]",
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
      },
    ],
    starterCode: {
      javascript: ``,
      python: ``,
      java: ``,
      cpp: ``
    },
    constraints: [
      "2 ≤ nums.length ≤ 10⁴",
      "-10⁹ ≤ nums[i] ≤ 10⁹",
      "-10⁹ ≤ target ≤ 10⁹",
      "Only one valid answer exists.",
    ],
  },
  {
    id: "reverse-string",
    title: "Reverse String",
    description:
      "Write a function that reverses a string. The input string is given as an array of characters `s`.\n\nYou must do this by modifying the input array in-place with O(1) extra memory.",
    examples: [
      {
        input: 's = ["h","e","l","l","o"]',
        output: '["o","l","l","e","h"]',
      },
      {
        input: 's = ["H","a","n","n","a","h"]',
        output: '["h","a","n","n","a","H"]',
      },
    ],
    starterCode: {
      javascript: ``,
      python: ``,
      java: ``,
      cpp: ``
    },
  },
  {
    id: "palindrome-number",
    title: "Palindrome Number",
    description:
      "Given an integer `x`, return `true` if `x` is a palindrome, and `false` otherwise.\n\nAn integer is a palindrome when it reads the same forward and backward.",
    examples: [
      {
        input: "x = 121",
        output: "true",
        explanation: "121 reads as 121 from left to right and from right to left.",
      },
      {
        input: "x = -121",
        output: "false",
        explanation: "From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome.",
      },
    ],
    starterCode: {
      javascript: ``,
      python: ``,
      java: ``,
      cpp: ``
    },
  },
   {
    id: "valid-parentheses",
    title: "Valid Parentheses",
    description:
      "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.",
    examples: [
      {
        input: 's = "()"',
        output: "true",
      },
      {
        input: 's = "()[]{}"',
        output: "true",
      },
      {
        input: 's = "(]"',
        output: "false",
      },
    ],
    starterCode: {
      javascript: ``,
      python: ``,
      java: ``,
      cpp: ``,
    },
    constraints: [
      "1 ≤ s.length ≤ 10⁴",
      "s consists of parentheses only: '()[]{}'",
    ],
  },

  {
    id: "merge-two-sorted-lists",
    title: "Merge Two Sorted Lists",
    description:
      "You are given the heads of two sorted linked lists `list1` and `list2`.\n\nMerge the two lists into one sorted list. Return the head of the merged linked list.",
    examples: [
      {
        input: "list1 = [1,2,4], list2 = [1,3,4]",
        output: "[1,1,2,3,4,4]",
      },
      {
        input: "list1 = [], list2 = []",
        output: "[]",
      },
    ],
    starterCode: {
      javascript: ``,
      python: ``,
      java: ``,
      cpp: ``,
    },
    constraints: [
      "The number of nodes in both lists is in the range [0, 50].",
      "-100 ≤ Node.val ≤ 100",
      "Both list1 and list2 are sorted in non-decreasing order.",
    ],
  },

  {
    id: "climbing-stairs",
    title: "Climbing Stairs",
    description:
      "You are climbing a staircase. It takes `n` steps to reach the top.\n\nEach time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    examples: [
      {
        input: "n = 2",
        output: "2",
        explanation: "There are two ways: 1 step + 1 step, or 2 steps.",
      },
      {
        input: "n = 3",
        output: "3",
        explanation: "1+1+1, 1+2, 2+1",
      },
    ],
    starterCode: {
      javascript: ``,
      python: ``,
      java: ``,
      cpp: `//write your code here`,
    },
    constraints: [
      "1 ≤ n ≤ 45",
    ],
  },
  {
  id: "median-of-two-sorted-arrays",
  title: "Median of Two Sorted Arrays",
  description:
    "Given two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, return the median of the two sorted arrays.\n\nThe overall run time complexity should be O(log (m+n)).",
  examples: [
    {
      input: "nums1 = [1,3], nums2 = [2]",
      output: "2.00000",
      explanation: "The merged array is [1,2,3] and the median is 2.",
    },
    {
      input: "nums1 = [1,2], nums2 = [3,4]",
      output: "2.5",
      explanation: "The merged array is [1,2,3,4] and the median is (2 + 3) / 2 = 2.5.",
    },
  ],
  starterCode: {
    javascript: ``,
    python: ``,
    java: ``,
    cpp: ``,
  },
  constraints: [
    "nums1.length == m",
    "nums2.length == n",
    "0 ≤ m, n ≤ 1000",
    "1 ≤ m + n ≤ 2000",
    "-10⁶ ≤ nums1[i], nums2[i] ≤ 10⁶",
  ],
},
{
  id: "merge-k-sorted-lists",
  title: "Merge k Sorted Lists",
  description:
    "You are given an array of `k` linked-lists `lists`, each linked list is sorted in ascending order.\n\nMerge all the linked lists into one sorted linked list and return it.",
  examples: [
    {
      input: "lists = [[1,4,5],[1,3,4],[2,6]]",
      output: "[1,1,2,3,4,4,5,6]",
    },
    {
      input: "lists = []",
      output: "[]",
    },
    {
      input: "lists = [[]]",
      output: "[]",
    },
  ],
  starterCode: {
    javascript: ``,
    python: ``,
    java: ``,
    cpp: ``,
  },
  constraints: [
    "k == lists.length",
    "0 ≤ k ≤ 10⁴",
    "0 ≤ lists[i].length ≤ 500",
    "-10⁴ ≤ lists[i][j] ≤ 10⁴",
  ],
},
{
  id: "word-ladder",
  title: "Word Ladder",
  description:
    "A transformation sequence from word `beginWord` to word `endWord` using a dictionary `wordList` is a sequence of words such that:\n\n1. The first word is `beginWord`\n2. The last word is `endWord`\n3. Only one letter can be changed at a time\n4. Each transformed word must exist in the word list.\n\nReturn the **number of words** in the shortest transformation sequence from `beginWord` to `endWord`, or 0 if no such sequence exists.",
  examples: [
    {
      input: "beginWord = 'hit', endWord = 'cog', wordList = ['hot','dot','dog','lot','log','cog']",
      output: "5",
      explanation: "'hit' -> 'hot' -> 'dot' -> 'dog' -> 'cog'",
    },
    {
      input: "beginWord = 'hit', endWord = 'cog', wordList = ['hot','dot','dog','lot','log']",
      output: "0",
      explanation: "'cog' is not in wordList, so return 0.",
    },
  ],
  starterCode: {
    javascript: ``,
    python: ``,
    java: ``,
    cpp: ``,
  },
  constraints: [
    "1 ≤ beginWord.length ≤ 10",
    "endWord.length == beginWord.length",
    "1 ≤ wordList.length ≤ 5000",
    "wordList[i].length == beginWord.length",
    "All words consist of lowercase English letters only.",
  ],
},

];

export interface CodeQuestion {
  id: string;
  title: string;
  description: string;
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  starterCode: {
    javascript: string;
    python: string;
    java: string;
    cpp: string;
  };
  constraints?: string[];
}

export type QuickActionType = (typeof QUICK_ACTIONS)[number];

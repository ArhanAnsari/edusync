# 🎨 AI Teacher Tools - Visual Guide

## 📊 Integration Overview

```
┌─────────────────────────────────────────────────────────┐
│                   Teacher Dashboard                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  📝 Assignments Page          🏆 Grading Center        │
│  ─────────────────            ─────────────────        │
│  ├─ Create Form               ├─ Statistics            │
│  │  ├─ Title Input            │  ├─ Total: X           │
│  │  ├─ Description            │  ├─ Graded: X          │
│  │  │  └─ [✨ Get AI]◄─────┐  │  ├─ Pending: X         │
│  │  └─ Due Date               │  └─ Avg Grade: X       │
│  │                            │                         │
│  └─ AI Suggestions Card◄──────┤  ├─ Submissions List   │
│     ├─ Generated text         │  │  └─ Grade Button    │
│     ├─ [Copy] [Use This]      │  │     └─ [✨ Get AI]◄──┐
│     └─ Auto-fills form        │  │                     │
│                               │  └─ Grading Modal     │
│                               │     ├─ Grade input    │
│                               │     ├─ Feedback      │
│                               │     └─ AI Card       │
│                               │        ├─ Grade: X/100│
│                               │        ├─ Feedback   │
│                               │        └─ Actions    │
│                               │                      │
└─────────────────────────────────────────────────────────┘
```

## 🔄 Assignments Page - User Flow

```
START
  │
  ├─► Click "Create Assignment" button
  │     │
  │     ├─► Form appears (title, description, date)
  │     │
  │     ├─► Enter title (e.g., "Photosynthesis")
  │     │
  │     ├─► [✨ Get AI Suggestions] button
  │     │     │
  │     │     ├─► Loading: "Generating..."
  │     │     │
  │     │     └─► ┌─────────────────────────────┐
  │     │         │  AI SUGGESTION CARD         │
  │     │         ├─────────────────────────────┤
  │     │         │                             │
  │     │         │ [✨ Suggested Description] │
  │     │         │                             │
  │     │         │ Generated text about       │
  │     │         │ photosynthesis project...  │
  │     │         │                             │
  │     │         │ [Copy] [Use This]          │
  │     │         └─────────────────────────────┘
  │     │           │       │
  │     │           │       └─ Use This ─►  Description textarea filled
  │     │           └─ Copy ──►  Clipboard + "Copied" feedback
  │     │
  │     ├─► Set due date
  │     │
  │     └─► [Create Assignment] ✓
  │
  END
```

## 🏆 Grading Page - User Flow

```
START
  │
  ├─► Navigate to Grading Center
  │
  ├─► View statistics:
  │    Total: X │ Graded: X │ Pending: X │ Avg: X
  │
  ├─► Click [Grade] on submission
  │     │
  │     └─► GRADING MODAL OPENS
  │         ├─ Student name
  │         ├─ Assignment title
  │         ├─ Submission date
  │         │
  │         ├─ Submission content
  │         │  (scrollable preview)
  │         │
  │         ├─ Grade input (0-100)
  │         │
  │         ├─ Feedback textarea
  │         │
  │         ├─ [✨ Get AI Suggestions]
  │         │     │
  │         │     ├─► Loading: "Generating..."
  │         │     │
  │         │     └─► ┌────────────────────────────────┐
  │         │         │  AI SUGGESTIONS CARD           │
  │         │         ├────────────────────────────────┤
  │         │         │                                │
  │         │         │ ┌─ SUGGESTED GRADE ───────┐  │
  │         │         │ │                         │  │
  │         │         │ │  85/100  [Use Grade]   │  │
  │         │         │ │                         │  │
  │         │         │ └─────────────────────────┘  │
  │         │         │                                │
  │         │         │ ┌─ SUGGESTED FEEDBACK ────┐  │
  │         │         │ │                         │  │
  │         │         │ │ [Copy] Feedback text   │  │
  │         │         │ │                         │  │
  │         │         │ │ "Excellent work...     │  │
  │         │         │ │  Consider expanding..." │  │
  │         │         │ │                         │  │
  │         │         │ │ [Use This Feedback]    │  │
  │         │         │ │                         │  │
  │         │         │ └─────────────────────────┘  │
  │         │         │                                │
  │         │         │ [Use All Suggestions]         │
  │         │         │                                │
  │         │         └────────────────────────────────┘
  │         │           │  │  │
  │         │           │  │  └─ Use This Feedback  ──► Feedback filled
  │         │           │  └──► Use Grade  ────────── ► Grade filled
  │         │           └────► Use All ──────────────► Both filled
  │         │
  │         ├─► [Cancel] or [Submit Grade]
  │         │
  │         └─► Success message ✓
  │
  END
```

## 🎨 UI Component Layout

### Assignments Page

```
┌──────────────────────────────────────────────────────────────┐
│ 📝 Assignments                                               │
│ Create and manage assignments for your students              │
│                                    [➕ Create Assignment]    │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ ┌─ Create New Assignment ──────────────────────────────────┐ │
│ │                                                          │ │
│ │ Assignment Title *                                       │ │
│ │ [______________________________________]                │ │
│ │                                                          │ │
│ │ Description *                                            │ │
│ │ ┌──────────────────────────────────────┐               │ │
│ │ │ . . . . . . . . . . . . . . . . . .  │               │ │
│ │ │ . . . . . . . . . . . . . . . . . .  │               │ │
│ │ │ . . . . . . . . . . . . . . . . . .  │               │ │
│ │ └──────────────────────────────────────┘               │ │
│ │ [✨ Get AI Suggestions]                                 │ │
│ │                                                          │ │
│ │ ┌─ AI SUGGESTION ──────────────────────────────────┐   │ │
│ │ │                                                  │   │ │
│ │ │ [✨] Suggested Description                       │   │ │
│ │ │                    [Copy] [Use This]             │   │ │
│ │ │                                                  │   │ │
│ │ │ Generated description text that can be          │   │ │
│ │ │ copied or used directly...                      │   │ │
│ │ │                                                  │   │ │
│ │ └──────────────────────────────────────────────────┘   │ │
│ │                                                          │ │
│ │ Due Date *                                               │ │
│ │ [2025-10-21 15:30]                                      │ │
│ │                                                          │ │
│ │                          [Cancel] [Create Assignment]   │ │
│ │                                                          │ │
│ └──────────────────────────────────────────────────────────┘ │
│                                                              │
│ All Assignments                                              │
│ ┌─────────────────────┬──────────────────┬────────────────┐ │
│ │ 📖 Title 1          │ Pending          │ Due: Oct 28    │ │
│ │ Description...      │                  │ [Delete]       │ │
│ └─────────────────────┴──────────────────┴────────────────┘ │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Grading Page - Modal

```
┌──────────────────────────────────────────────────────────────┐
│ Grade Submission                                             │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ ┌─ SUBMISSION INFO ────────────────────────────────────────┐ │
│ │ Student: John Doe          Assignment: Photosynthesis   │ │
│ │ Submitted: Oct 20, 2:45 PM                              │ │
│ └──────────────────────────────────────────────────────────┘ │
│                                                              │
│ Submission Content                                           │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ Student's work content here...                        │ │
│ │ Multiple paragraphs of the assignment submission...   │ │
│ │                                                        │ │
│ └────────────────────────────────────────────────────────┘ │
│                                                              │
│ Grade (0-100) *                                              │
│ [__________]                                                │
│                                                              │
│ Feedback                                                     │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ . . . . . . . . . . . . . . . . . . . . . . . . . .   │ │
│ │ . . . . . . . . . . . . . . . . . . . . . . . . . .   │ │
│ │ . . . . . . . . . . . . . . . . . . . . . . . . . .   │ │
│ │ . . . . . . . . . . . . . . . . . . . . . . . . . .   │ │
│ └────────────────────────────────────────────────────────┘ │
│ [✨ Get AI Suggestions]                                    │
│                                                              │
│ ┌─ AI SUGGESTIONS ───────────────────────────────────────┐ │
│ │                                                        │ │
│ │ ┌─ Suggested Grade ──────────────────────────────┐  │ │
│ │ │                                                │  │ │
│ │ │  85/100                    [Use Grade]        │  │ │
│ │ │                                                │  │ │
│ │ └────────────────────────────────────────────────┘  │ │
│ │                                                        │ │
│ │ ┌─ Suggested Feedback ───────────────────────────┐  │ │
│ │ │ [Copy] "Excellent work on this assignment..."  │  │ │
│ │ │ Consider expanding the conclusion section...   │  │ │
│ │ │ [Use This Feedback]                            │  │ │
│ │ └────────────────────────────────────────────────┘  │ │
│ │                                                        │ │
│ │ [Use All Suggestions]                                │ │
│ │                                                        │ │
│ └────────────────────────────────────────────────────────┘ │
│                                                              │
│                        [Cancel] [Submit Grade]              │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## 🎯 Color Scheme

### AI Components
- **Primary Color**: Purple (`#9333ea`)
- **Secondary**: Blue (`#3b82f6`)
- **Gradient**: `from-purple-900 to-blue-900`
- **Border**: `border-purple-600`
- **Icon**: Sparkles (✨) in purple

### Buttons
| Button Type | Color | Usage |
|-------------|-------|-------|
| Get AI | Purple | Primary AI action |
| Use/Apply | Purple | Accept suggestion |
| Copy | Gray | Copy to clipboard |
| Copied ✓ | Green | Feedback state |
| Submit | Blue | Final action |

## 📱 Mobile Responsive

### Desktop (> 1024px)
```
┌─────────────────────────────────────┐
│ Form (left)    │  Suggestions (right) │
│ 40%            │  60%                 │
└─────────────────────────────────────┘
```

### Tablet (768px - 1024px)
```
┌─────────────────────────────────────┐
│ Form (full)                         │
│                                     │
├─────────────────────────────────────┤
│ Suggestions (full)                  │
│                                     │
└─────────────────────────────────────┘
```

### Mobile (< 768px)
```
┌──────────────────┐
│ Form (full)      │
│                  │
├──────────────────┤
│ Suggestions      │
│ (scrollable)     │
│                  │
└──────────────────┘
```

## 🔄 State Transitions

### Loading State
```
Button Text:  "Get AI Suggestions" → "Generating..." → "Get AI Suggestions"
Button State: Enabled            → Disabled        → Enabled
Loading Icon: None               → Spinner         → None
```

### Copy Feedback
```
Button:       [Copy] → [Copied ✓] (2 seconds) → [Copy]
Tooltip:      None   → "Copied!"  (2 seconds) → None
```

## ⚡ Performance Indicators

### Response Times
```
Assignment Suggestions:
Time: 0s ──► 2-4s (AI processing) ──► Card appears ✓

Grading Suggestions:
Time: 0s ──► 3-5s (AI processing) ──► Card appears ✓

Copy to Clipboard:
Time: 0s ──► 100ms ──► "Copied" indicator ✓
```

## 🎯 Accessibility

### Keyboard Navigation
- Tab: Navigate between elements
- Enter: Activate buttons
- Space: Toggle checkboxes
- Escape: Close modals

### Screen Reader Support
- Icons have alt text (Sparkles, Copy, etc.)
- Buttons have clear labels
- Status messages announced
- Loading states announced

---

*Visual Guide: October 21, 2025*  
*Version: 1.0*

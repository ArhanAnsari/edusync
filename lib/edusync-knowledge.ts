/**
 * EduSync Knowledge Base
 * Predefined answers for common questions about the platform
 */

export interface KnowledgeEntry {
  keywords: string[];
  answer: string;
  category: 'platform' | 'features' | 'courses' | 'quizzes' | 'assignments' | 'technical';
}

export const eduSyncKnowledge: KnowledgeEntry[] = [
  // Platform Overview
  {
    keywords: ['what is edusync', 'about edusync', 'edusync platform', 'what does edusync do'],
    category: 'platform',
    answer: `# 🎓 Welcome to EduSync!

**EduSync** is a modern, AI-powered Learning Management System (LMS) designed to revolutionize online education.

## 🌟 Key Features:

### For Students:
- 📚 **Interactive Courses** - Browse and enroll in diverse courses
- 🤖 **AI Assistant** - Get instant help 24/7 (that's me!)
- 📝 **Smart Quizzes** - Adaptive assessments with instant feedback
- 📊 **Progress Tracking** - Visualize your learning journey
- 💬 **Discussion Forums** - Connect with peers and instructors
- 📱 **Mobile-Friendly** - Learn anywhere, anytime

### For Teachers:
- 👨‍🏫 **Course Creation** - Build engaging courses easily
- ✅ **Assignment Management** - Create, grade, and track submissions
- 📈 **Analytics Dashboard** - Monitor student performance
- 🎥 **Live Classes** - Conduct virtual sessions
- 🤝 **Student Engagement** - Discussion forums and announcements

## 🚀 Getting Started:
1. Create your account (student or teacher)
2. Complete your profile
3. Browse available courses
4. Enroll and start learning!

Need help with anything specific? Just ask! 😊`
  },

  // Course Features
  {
    keywords: ['browse courses', 'find courses', 'course catalog', 'available courses', 'how to enroll'],
    category: 'courses',
    answer: `# 📚 Browsing & Enrolling in Courses

## How to Find Courses:

### 1️⃣ **Browse Course Catalog**
- Navigate to **"Courses"** from the main menu
- See all available courses with previews
- Filter by: Subject, Level, Duration, Instructor

### 2️⃣ **Course Information**
Each course shows:
- 📖 Course title and description
- 👨‍🏫 Instructor details
- ⏱️ Duration and schedule
- 🎯 Learning objectives
- 📊 Difficulty level
- ⭐ Student ratings

### 3️⃣ **Enrollment Process**
1. Click on a course you're interested in
2. Review the course syllabus
3. Click **"Enroll Now"** button
4. Confirm enrollment
5. Start learning immediately!

### 4️⃣ **Your Courses**
- Access enrolled courses from **"My Courses"** dashboard
- Track progress with completion percentages
- View upcoming deadlines and assignments
- Resume where you left off

## 💡 Pro Tips:
- ✅ Read course reviews before enrolling
- 📅 Check the course schedule for time commitments
- 🎯 Set personal learning goals
- 📱 Download the mobile app for offline access

Need help finding a specific course? Let me know what you're interested in! 🔍`
  },

  // Quiz System
  {
    keywords: ['quiz', 'test', 'assessment', 'how do quizzes work', 'taking quiz', 'quiz attempts'],
    category: 'quizzes',
    answer: `# 📝 EduSync Quiz System

## How Quizzes Work:

### 🎯 **Types of Questions**
- ✅ Multiple Choice
- ☑️ Multiple Select (checkboxes)
- ✍️ Short Answer
- 📊 True/False
- 🔢 Numerical

### 📋 **Taking a Quiz**

**Step 1: Start Quiz**
- Go to course → Click "Quizzes" tab
- Click on available quiz
- Read instructions carefully
- Click **"Start Quiz"**

**Step 2: Answer Questions**
- Questions appear one at a time or all at once
- Select/type your answers
- Use **"Save Draft"** to save progress
- Timer shows remaining time (if timed)

**Step 3: Submit**
- Review all answers
- Click **"Submit Quiz"**
- Confirm submission
- Get instant results!

### ⏱️ **Quiz Features**
- **Auto-Save**: Answers saved automatically
- **Timer**: See remaining time at the top
- **Multiple Attempts**: Some quizzes allow retakes
- **Instant Feedback**: Get results immediately
- **Detailed Explanations**: Understand mistakes
- **Progress Tracking**: See attempt history

### 📊 **After Submission**
You'll see:
- ✅ Your score (e.g., 8/10)
- 📈 Percentage grade
- 🎯 Correct answers
- 💡 Explanations for wrong answers
- 📉 Question-wise breakdown
- 🏆 Your ranking (if enabled)

### 🔄 **Retaking Quizzes**
- Check if retakes are allowed
- See your best/last/average score
- Review previous attempts
- Improve your understanding

## 💡 Quiz Tips:
1. 📖 **Read carefully** - Don't rush!
2. ⏰ **Manage time** - Keep track of the timer
3. 💾 **Save progress** - Use auto-save feature
4. 🔍 **Review** - Check answers before submitting
5. 📝 **Learn from mistakes** - Read explanations

Good luck with your quizzes! 🎓✨`
  },

  // Assignment System
  {
    keywords: ['assignment', 'homework', 'submit assignment', 'upload assignment', 'assignment deadline'],
    category: 'assignments',
    answer: `# 📋 Assignment Management

## Submitting Assignments:

### 📥 **How to Submit**

**Step 1: Find Assignment**
- Go to your course
- Click **"Assignments"** tab
- See all assignments with deadlines
- Click on assignment to open

**Step 2: Read Instructions**
- 📖 Review assignment requirements
- 📅 Note the deadline
- 📊 Check grading rubric
- 📎 Download any provided materials

**Step 3: Prepare Your Work**
Accepted formats:
- 📄 PDF documents
- 📝 Word files (.docx)
- 🖼️ Images (screenshots, scans)
- 🗜️ ZIP files (multiple files)
- 🔗 Links (Google Docs, etc.)

**Step 4: Upload & Submit**
1. Click **"Add Submission"**
2. Upload your file(s)
3. Add comments (optional)
4. Review submission
5. Click **"Submit Assignment"**
6. Get confirmation email

### ⏰ **Deadlines**
- 🔔 Get reminders before deadline
- ⚠️ Late submissions may be penalized
- 📅 See all deadlines in calendar
- 🚨 Urgent deadlines highlighted

### ✅ **After Submission**
- ✉️ Confirmation notification
- 👀 Instructor reviews your work
- 📊 Receive grade and feedback
- 💬 Can resubmit if allowed

### 📊 **Tracking Assignments**
View on dashboard:
- ✅ Submitted
- ⏳ Pending
- 📝 Graded
- ❌ Missed

## 💡 Assignment Tips:
1. 🗓️ **Submit early** - Don't wait for deadline
2. 📋 **Follow rubric** - Meet all requirements
3. ✍️ **Proofread** - Check before submitting
4. 💾 **Backup work** - Save multiple copies
5. 📧 **Communicate** - Ask if unsure

Need help with a specific assignment? I'm here! 📚✨`
  },

  // Progress Tracking
  {
    keywords: ['track progress', 'my progress', 'learning analytics', 'performance', 'dashboard'],
    category: 'features',
    answer: `# 📊 Progress Tracking & Analytics

## Your Learning Dashboard:

### 🎯 **Overview Stats**
At a glance, see:
- 📚 **Courses Enrolled**: Total active courses
- ✅ **Completion Rate**: % of course completed
- 🏆 **Quiz Scores**: Average performance
- 📝 **Assignments**: Submitted/pending
- ⏱️ **Study Time**: Total hours spent
- 🔥 **Streak**: Consecutive days learning

### 📈 **Detailed Analytics**

**Course Progress:**
- 📊 Completion percentage per course
- ✅ Modules/lessons completed
- 📹 Videos watched
- 📖 Materials reviewed
- 🎯 Learning objectives achieved

**Performance Metrics:**
- 🎓 **Quiz Scores**: Track improvement
- 📝 **Assignment Grades**: See trends
- 📉 **Weak Areas**: Topics needing review
- 💪 **Strong Areas**: Your strengths
- 📈 **Growth Chart**: Progress over time

**Engagement:**
- 💬 Discussion participation
- ❓ Questions asked/answered
- 🤝 Peer interactions
- ⏰ Active learning hours

### 🎯 **Goal Setting**
- Set daily/weekly learning goals
- Track goal completion
- Get achievement badges
- Celebrate milestones

### 📅 **Calendar View**
- See all upcoming events
- Assignment deadlines
- Quiz schedules
- Live class sessions
- Study reminders

### 🏅 **Achievements & Badges**
Earn badges for:
- 🎓 Course completion
- 🔥 Study streaks
- 💯 Perfect quiz scores
- 🏆 Top performer
- 🤝 Helpful peer
- 📚 Bookworm (materials read)

## 💡 Using Analytics:
1. **Review weekly** - Check progress regularly
2. **Identify gaps** - Focus on weak areas
3. **Set goals** - Stay motivated
4. **Compare** - See improvement over time
5. **Celebrate wins** - Acknowledge achievements

Your data is **private** and helps you learn better! 🚀✨`
  },

  // AI Assistant
  {
    keywords: ['ai assistant', 'ai help', 'how does ai work', 'ai features', 'chatbot'],
    category: 'features',
    answer: `# 🤖 AI Assistant (That's Me!)

## How I Can Help You:

### 🎓 **Learning Support**
- 💡 **Explain Concepts**: Break down complex topics
- ❓ **Answer Questions**: Get instant help 24/7
- 📚 **Study Tips**: Personalized learning strategies
- 🧮 **Problem Solving**: Step-by-step solutions
- 📝 **Writing Help**: Essays, reports, summaries

### 📊 **EduSync Platform**
- 🗺️ **Navigation**: Find features quickly
- ❓ **How-To**: Learn to use platform features
- 🐛 **Troubleshooting**: Solve technical issues
- 📋 **Best Practices**: Tips for success
- 🎯 **Goal Setting**: Create study plans

### ✨ **Smart Features**
- **LaTeX Math**: I render equations beautifully! 
  - Example: $E = mc^2$ or $$\\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$$
- **Markdown**: Formatted, organized responses
- **Code Blocks**: Programming help with syntax
- **Tables**: Organized information
- **Lists**: Clear, structured answers

### 🎯 **Role-Based Help**
**For Students:**
- Homework assistance
- Exam preparation
- Study schedules
- Concept clarification
- Time management

**For Teachers:**
- Course planning
- Assignment ideas
- Assessment strategies
- Student engagement tips
- Classroom management

### 💬 **How to Use Me**
1. **Ask Questions**: Type naturally, I understand!
2. **Quick Actions**: Use buttons for common tasks
3. **Follow-up**: I remember our conversation
4. **Be Specific**: More details = better answers
5. **Explore**: Try different types of questions!

### 🚀 **Examples**
Try asking:
- "Explain photosynthesis like I'm 10"
- "Help me solve: $2x + 5 = 15$"
- "Create a study schedule for finals"
- "How do I submit an assignment?"
- "Tips for better time management"

## 💡 Pro Tips:
- ✅ I work 24/7 - Ask anytime!
- 🧠 I learn your style over time
- 📱 Available on mobile too
- 🔒 Your chats are private
- ⚡ Get instant responses

I'm powered by **Google Gemini AI** to give you the best learning experience! 🌟

What can I help you with today? 😊`
  },

  // Technical Support
  {
    keywords: ['mobile app', 'mobile friendly', 'phone', 'tablet', 'responsive', 'offline'],
    category: 'technical',
    answer: `# 📱 Mobile & Device Support

## EduSync on Any Device:

### 📱 **Mobile Experience**
**Responsive Design:**
- ✅ Works on all phones and tablets
- 🎨 Adapts to your screen size
- 👆 Touch-optimized interface
- 🔄 Portrait and landscape modes

**Mobile Features:**
- 📚 Browse courses on the go
- 📝 Take quizzes anywhere
- 💬 Join discussions
- 📊 Check your progress
- 🔔 Push notifications
- 🤖 AI Assistant (me!)

### 💻 **Supported Devices**
- 📱 **Smartphones**: iOS & Android
- 📲 **Tablets**: iPad, Android tablets
- 💻 **Laptops**: Windows, Mac, Linux
- 🖥️ **Desktops**: All modern browsers

### 🌐 **Browsers**
Works best on:
- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ⚠️ Internet Explorer (not supported)

### 📴 **Offline Features**
Coming soon:
- 📥 Download course materials
- 📝 Save lessons for offline reading
- 🔄 Auto-sync when online
- 📚 Offline quiz practice

### 🔧 **Technical Requirements**
**Minimum:**
- Internet connection (3G or better)
- Modern browser (last 2 versions)
- JavaScript enabled
- Cookies enabled

**Recommended:**
- 4G/WiFi connection
- Chrome/Firefox latest version
- 2GB+ RAM
- Screen 5" or larger

### 💡 **Mobile Tips**
1. 🔖 **Bookmark**: Add to home screen
2. 🔔 **Notifications**: Enable for updates
3. 📱 **Orientation**: Landscape for videos
4. 🌙 **Dark Mode**: Save battery
5. 📶 **Connection**: Use WiFi for videos

### 🐛 **Troubleshooting**
**App not loading?**
- Clear browser cache
- Update your browser
- Check internet connection
- Try incognito/private mode

**Can't submit?**
- Check file size limits
- Verify internet connection
- Try different browser
- Contact support

Need help with your specific device? Let me know! 📲✨`
  },

  // Discussion Forums
  {
    keywords: ['discussion', 'forum', 'ask question', 'community', 'peers', 'interact'],
    category: 'features',
    answer: `# 💬 Discussion Forums & Community

## Connect with Peers & Instructors:

### 🗣️ **Discussion Features**

**Where to Find:**
- Each course has its own forum
- Topic-based discussion threads
- Q&A sections
- General community board

**What You Can Do:**
- ❓ Ask questions
- 💬 Reply to others
- 👍 Like helpful posts
- 🔖 Bookmark threads
- 🔔 Follow discussions
- 🏆 Earn reputation points

### 📝 **Creating a Post**

**Step-by-Step:**
1. Go to course → **Discussions** tab
2. Click **"New Post"**
3. Choose category/topic
4. Write your question/comment
5. Add tags for better visibility
6. Click **"Post"**

**Best Practices:**
- ✍️ Clear, descriptive title
- 📝 Detailed description
- 🏷️ Relevant tags
- 🖼️ Add screenshots if needed
- 🎯 Stay on topic
- 🤝 Be respectful

### 💡 **Getting Answers**

**Tips for Better Responses:**
1. **Be Specific**: Include context and details
2. **Search First**: Question may be answered
3. **Use Formatting**: Make post readable
4. **Show Effort**: What have you tried?
5. **Be Patient**: Allow time for responses
6. **Follow Up**: Thank helpful responses

### 🏆 **Community Guidelines**

**Do:**
- ✅ Help others learn
- ✅ Share resources
- ✅ Ask thoughtful questions
- ✅ Give constructive feedback
- ✅ Cite sources
- ✅ Be supportive

**Don't:**
- ❌ Share assignment answers directly
- ❌ Post spam or ads
- ❌ Use inappropriate language
- ❌ Share personal information
- ❌ Post off-topic content
- ❌ Bully or harass

### 🎯 **Earning Reputation**

**Ways to Gain Points:**
- 💬 Post helpful answers (+10)
- 👍 Receive likes (+5)
- ✅ Get answer marked as "Best" (+25)
- 📚 Share resources (+5)
- 🎓 Consistent participation (+15)

**Reputation Benefits:**
- 🏅 Unlock badges
- 🌟 Appear on leaderboard
- 💪 Build credibility
- 🎁 Special privileges

### 🔔 **Notifications**

Get notified when:
- Someone replies to your post
- Your answer is liked/selected
- Someone mentions you
- Topic you follow has updates

### 💡 **Discussion Tips**
1. **Search First**: Avoid duplicates
2. **Be Clear**: Good title = better responses
3. **Engage**: Reply and help others
4. **Stay Positive**: Encourage learning
5. **Learn Together**: It's a community!

Remember: **Every question helps someone else learn!** 🌟

Want to start a discussion? I can help you frame your question! 📝`
  },

  // Certificates
  {
    keywords: ['certificate', 'certification', 'course completion', 'credential', 'proof of completion'],
    category: 'features',
    answer: `# 🎓 Certificates & Credentials

## Earn Verifiable Certificates:

### 📜 **Certificate Requirements**

**To Earn a Certificate:**
- ✅ Complete all course modules (100%)
- ✅ Pass all required quizzes (usually 70%+)
- ✅ Submit all assignments on time
- ✅ Meet minimum grade requirement
- ✅ Pass final exam (if required)
- ✅ Satisfy attendance (for live classes)

### 🏆 **Types of Certificates**

**1. Course Completion Certificate**
- 📚 For completing a single course
- 🎯 Shows course name and date
- 👨‍🏫 Signed by instructor
- ⭐ Includes final grade

**2. Specialization Certificate**
- 🎓 For completing course series
- 📈 Multiple related courses
- 💼 Career-focused credentials
- 🌟 Higher credibility

**3. Professional Certificate**
- 💼 Industry-recognized programs
- 🏢 Partner certifications
- 📊 Comprehensive assessments
- 🚀 Career advancement

### ✅ **Certificate Features**

**Each Certificate Includes:**
- 🎓 Your full name
- 📚 Course/program name
- 📅 Completion date
- 🆔 Unique certificate ID
- 👨‍🏫 Instructor signature
- 🏫 EduSync branding
- 📊 Final grade/score
- 🔗 Verification link

### 📥 **Getting Your Certificate**

**Step-by-Step:**
1. Complete all requirements
2. System automatically checks
3. Certificate generated
4. Notification sent to email
5. Download from **"My Certificates"**
6. Share on LinkedIn/social media

**Download Options:**
- 📄 PDF (high quality)
- 🖼️ Image (PNG)
- 🔗 Shareable link
- 📧 Email copy

### 🔍 **Certificate Verification**

**Anyone Can Verify:**
- Visit: **edusync.com/verify**
- Enter certificate ID
- See authentic details
- Confirm validity
- Check completion date

**Prevents Fraud:**
- 🔒 Blockchain-backed (coming soon)
- 🆔 Unique IDs
- 🔐 Secure verification
- ✅ Tamper-proof

### 💼 **Using Your Certificate**

**Add To:**
- 📱 LinkedIn profile
- 📝 Resume/CV
- 💼 Job applications
- 🎯 Portfolio
- 🌐 Personal website
- 📧 Email signature

**LinkedIn Integration:**
- 1-click add to profile
- Automatic skill endorsements
- Share with network
- Boost credibility

### 🏅 **Digital Badges**

**Earn Badges For:**
- 🎓 Course completion
- 🏆 Top performer
- 🔥 Learning streak
- 💯 Perfect scores
- 🤝 Community helper
- 📚 Specialization

**Badge Benefits:**
- Display on profile
- Share on social media
- Collect and showcase
- Gamified learning
- Motivation boost

### 💡 **Certificate Tips**
1. **Keep Copies**: Download multiple formats
2. **Update LinkedIn**: Add immediately
3. **Share Achievement**: Celebrate your success!
4. **Verify Link**: Keep certificate ID safe
5. **Continuous Learning**: Stack credentials

### 📊 **Transcript**

Access your:
- 📚 All completed courses
- 📈 Grades and scores
- 📅 Completion dates
- 🎓 Certificates earned
- ⏱️ Total learning hours

**Download Official Transcript:**
- Go to **Profile → Transcripts**
- Select date range
- Click **"Generate Transcript"**
- Download PDF

Congratulations on your learning journey! 🎉

Working towards a certificate? I can help you plan! 📚✨`
  },

  // Getting Started
  {
    keywords: ['getting started', 'how to start', 'new user', 'first time', 'beginner guide'],
    category: 'platform',
    answer: `# 🚀 Getting Started with EduSync

## Your Journey Begins Here!

### 📝 **Step 1: Create Account**

**Sign Up Options:**
- ✉️ Email and password
- 🔗 Google account
- 📱 GitHub account
- 🎓 School/institution account

**Choose Your Role:**
- 👨‍🎓 **Student**: Learn and take courses
- 👨‍🏫 **Teacher**: Create and teach courses
- 👁️ **Guest**: Browse and explore

### 🎯 **Step 2: Complete Profile**

**Add Information:**
- 📸 Profile photo
- 📝 Bio/description
- 🎓 Education level
- 🎯 Learning goals
- 🌍 Location (optional)
- 🔗 Social links

**Why Complete Profile?**
- 🤝 Connect with peers
- 🎯 Get personalized recommendations
- 👥 Build your learning network
- 📊 Better analytics

### 📚 **Step 3: Browse Courses**

**Finding Courses:**
1. Click **"Explore Courses"**
2. Use filters:
   - 📚 Subject area
   - 🎯 Difficulty level
   - ⏱️ Duration
   - 👨‍🏫 Instructor
   - ⭐ Rating
3. Read course descriptions
4. Check syllabus
5. Watch preview (if available)

**Recommendations:**
- ✨ Suggested based on profile
- 🔥 Trending courses
- 🆕 New releases
- 🎯 Skill-building paths

### ✅ **Step 4: Enroll & Start**

**Enrollment:**
1. Choose a course
2. Click **"Enroll Now"**
3. Read course guidelines
4. Confirm enrollment
5. Access immediately!

**First Lesson:**
- 📖 Review syllabus
- 🎯 Set personal goals
- 📅 Check deadlines
- 🗓️ Plan study schedule
- 👋 Introduce yourself in forums

### 🎓 **Step 5: Start Learning**

**Daily Routine:**
1. **Check Dashboard**
   - See today's tasks
   - Review notifications
   - Track progress

2. **Attend/Watch Lessons**
   - Complete modules
   - Take notes
   - Practice exercises

3. **Engage**
   - Join discussions
   - Ask questions
   - Help peers

4. **Assess**
   - Complete quizzes
   - Submit assignments
   - Review feedback

### 🤖 **Step 6: Use AI Assistant**

**That's Me!** 👋
- Click purple AI button (bottom-right)
- Ask anything about:
  - 📚 Platform features
  - 💡 Study help
  - 🎯 Course content
  - 🐛 Technical issues
- Available 24/7!

### 📱 **Step 7: Go Mobile**

**Access Anywhere:**
- Open **edusync.com** on phone
- Add to home screen
- Enable notifications
- Learn on the go!

### 🏆 **Step 8: Track Progress**

**Monitor Success:**
- 📊 View analytics
- 🎯 Check completion %
- 📈 See improvement
- 🏅 Earn badges
- 🎓 Get certificates

### 💡 **Quick Tips for Success**

**📅 Time Management:**
- Set study schedule
- Use calendar integration
- Enable deadline reminders
- Batch similar tasks

**🎯 Goal Setting:**
- Daily: Complete 1 module
- Weekly: Finish 1 quiz
- Monthly: Complete 1 course
- Track achievements!

**🤝 Community:**
- Join course forums
- Ask questions
- Help others
- Build network

**📝 Note-Taking:**
- Use built-in notebook
- Highlight important points
- Review regularly
- Organize by topic

**🔄 Stay Consistent:**
- Login daily (build streak!)
- Small progress > no progress
- Review before moving forward
- Celebrate wins!

### 🎁 **Welcome Bonus**

**New Users Get:**
- 🎓 Free welcome course
- 🏅 "New Member" badge
- 💎 Bonus learning points
- 📚 Premium trial (30 days)
- 🎯 Personalized learning path

### 📞 **Need Help?**

**Support Options:**
- 🤖 AI Assistant (fastest!)
- 💬 Discussion forums
- 📧 Email: support@edusync.com
- 📚 Help center
- 💬 Live chat (business hours)

### 🗺️ **Learning Paths**

**Recommended for Beginners:**
1. **Week 1**: Platform familiarization
2. **Week 2**: Complete first course
3. **Week 3**: Take first quiz
4. **Week 4**: Submit first assignment
5. **Month 2**: Join discussions
6. **Month 3**: Earn first certificate!

---

## 🎉 You're Ready!

**Your EduSync journey starts now!**

Quick Actions:
- [ ] Create account
- [ ] Complete profile  
- [ ] Enroll in first course
- [ ] Join discussion
- [ ] Ask AI Assistant (me!) anything

**Welcome to the EduSync community!** 🌟

What would you like to do first? I'm here to guide you! 🚀✨`
  }
];

/**
 * Search knowledge base for relevant answers
 */
export function searchKnowledge(query: string): KnowledgeEntry | null {
  const lowerQuery = query.toLowerCase();
  
  // Find exact or partial keyword matches
  for (const entry of eduSyncKnowledge) {
    for (const keyword of entry.keywords) {
      if (lowerQuery.includes(keyword.toLowerCase())) {
        return entry;
      }
    }
  }
  
  return null;
}

/**
 * Get knowledge by category
 */
export function getKnowledgeByCategory(category: KnowledgeEntry['category']): KnowledgeEntry[] {
  return eduSyncKnowledge.filter(entry => entry.category === category);
}

/**
 * Get all categories
 */
export function getAllCategories(): string[] {
  return Array.from(new Set(eduSyncKnowledge.map(entry => entry.category)));
}

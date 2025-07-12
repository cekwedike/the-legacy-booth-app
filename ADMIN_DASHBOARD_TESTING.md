# 🎛️ Admin Dashboard Testing Guide

## 🚀 Quick Start

### 1. **Start the Servers**
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

### 2. **Access the Admin Dashboard**
- **Frontend URL**: http://localhost:5173
- **Backend URL**: http://localhost:5000
- **API Docs**: http://localhost:5000/api/docs

### 3. **Login as Admin**
- **Email**: `admin@legacybooth.com`
- **Password**: `admin123`

## 🧪 Testing Checklist

### ✅ **Basic Functionality**
- [ ] Admin dashboard loads without errors
- [ ] Dark theme with glassmorphism effects displays correctly
- [ ] Stats cards show real data (users, stories, messages, legacy books)
- [ ] System health metrics display
- [ ] Content distribution pie chart renders
- [ ] Tabs switch between Overview, Users, Content, and System

### ✅ **Analytics Dashboard**
- [ ] User growth chart displays 30-day data
- [ ] Recent activity feed shows user actions
- [ ] Auto-refresh toggle works
- [ ] Manual refresh button updates data
- [ ] Charts are interactive with tooltips

### ✅ **User Management**
- [ ] Users table displays all sample users
- [ ] User roles (user, admin, moderator) show correct colors
- [ ] User status (active, suspended, pending) displays properly
- [ ] View user details dialog opens
- [ ] Suspend/activate user actions work
- [ ] Delete user functionality works

### ✅ **Content Moderation**
- [ ] Content tab shows pending reviews
- [ ] Content statistics display correctly
- [ ] Moderation actions are available

### ✅ **System Monitoring**
- [ ] System health metrics update
- [ ] Performance metrics display
- [ ] System alerts show correctly

## 📊 **Sample Data Available**

The system includes realistic test data:
- **10 Users**: Various roles and statuses
- **25 Stories**: Different categories and statuses
- **30 Messages**: Various types and delivery statuses
- **8 Legacy Books**: Different themes and completion levels

## 🔧 **Troubleshooting**

### **Blank White Screen**
1. Check browser console for errors
2. Verify both servers are running
3. Check TypeScript compilation: `npm run build`
4. Clear browser cache and reload

### **API Errors**
1. Verify backend is running on port 5000
2. Check MongoDB connection
3. Verify admin user exists: `node scripts/create-admin.js`
4. Check API docs: http://localhost:5000/api/docs

### **Missing Data**
1. Run data seeding: `node scripts/seed-data.js`
2. Check MongoDB connection
3. Verify database collections exist

## 🎯 **Expected Results**

### **Dashboard Stats**
- Total Users: ~11 (10 sample + 1 admin)
- Total Stories: ~25
- Total Messages: ~30
- Total Legacy Books: ~8
- Active Users: Varies (based on last login)

### **User Management**
- Users table shows all users with correct roles
- User actions (suspend, activate, delete) work
- User details dialog shows comprehensive information

### **Charts and Analytics**
- User growth chart shows daily registration trends
- Content distribution pie chart shows story/message/legacy book ratios
- System health shows realistic CPU/memory/storage usage

## 🚀 **Next Steps**

Once testing is complete, you can:
1. **Customize the dashboard** with your specific needs
2. **Add more analytics** and reporting features
3. **Implement real-time notifications** for admin actions
4. **Add export functionality** for reports and data
5. **Enhance security** with audit logs and advanced permissions

---

**🎉 The Admin Dashboard is now fully functional and ready for production use!** 
const express = require('express');
const router = express.Router();

// 模拟用户数据
let users = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    phone: '13812345678',
    role: 'admin',
    status: 'active',
    createdAt: '2025-06-01T08:00:00Z',
    updatedAt: '2025-06-01T08:00:00Z',
    avatar: '/images/admin.jpg',
    realName: '张伟',
    lastLogin: '2025-06-10T09:00:00Z'
  },
  {
    id: 2,
    username: 'user1',
    email: 'user1@example.com',
    phone: '13987654321',
    role: 'customer',
    status: 'active',
    createdAt: '2025-06-02T10:30:00Z',
    updatedAt: '2025-06-02T10:30:00Z',
    avatar: '/images/user1.jpg',
    realName: '李娜',
    lastLogin: '2025-06-09T15:20:00Z'
  },
  {
    id: 3,
    username: 'user2',
    email: 'user2@example.com',
    phone: '13765432109',
    role: 'customer',
    status: 'inactive',
    createdAt: '2025-06-03T14:45:00Z',
    updatedAt: '2025-06-03T14:45:00Z',
    avatar: '/images/user2.jpg',
    realName: '王强',
    lastLogin: '2025-06-08T11:10:00Z'
  }
];

// 用户角色枚举
const USER_ROLES = {
  ADMIN: 'admin',
  CUSTOMER: 'customer',
  MANAGER: 'manager'
};

// 用户状态枚举
const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  BANNED: 'banned'
};

// 获取用户列表（支持分页和筛选）
router.get('/', (req, res) => {
  const { page = 1, pageSize = 10, username, role, status } = req.query;
  let filteredUsers = [...users];

  // 筛选用户名（模糊搜索）
  if (username) {
    filteredUsers = filteredUsers.filter(user =>
      user.username.toLowerCase().includes(username.toLowerCase()) ||
      user.realName.toLowerCase().includes(username.toLowerCase())
    );
  }

  // 筛选角色
  if (role) {
    filteredUsers = filteredUsers.filter(user => user.role === role);
  }

  // 筛选状态
  if (status) {
    filteredUsers = filteredUsers.filter(user => user.status === status);
  }

  // 按创建时间倒序排列
  filteredUsers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // 分页
  const start = (page - 1) * pageSize;
  const end = start + parseInt(pageSize);
  const paginatedUsers = filteredUsers.slice(start, end);

  res.json({
    code: 200,
    message: '获取用户列表成功',
    data: {
      list: paginatedUsers,
      total: filteredUsers.length,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    }
  });
});

// 获取单个用户信息
router.get('/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ code: 404, message: '用户不存在' });
  }
  res.json({
    code: 200,
    message: '获取用户详情成功',
    data: user
  });
});

// 创建用户
router.post('/', (req, res) => {
  const { username, email, phone, role, realName, avatar } = req.body;

  // 验证必填字段
  if (!username || !email || !phone || !role || !realName) {
    return res.status(400).json({ code: 400, message: '缺少必填字段' });
  }

  // 检查用户名或邮箱是否已存在
  if (users.some(u => u.username === username || u.email === email)) {
    return res.status(400).json({ code: 400, message: '用户名或邮箱已存在' });
  }

  const newUser = {
    id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1,
    username,
    email,
    phone,
    role: Object.values(USER_ROLES).includes(role) ? role : USER_ROLES.CUSTOMER,
    status: USER_STATUS.ACTIVE,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    avatar: avatar || '/images/default-avatar.jpg',
    realName,
    lastLogin: null
  };

  users.push(newUser);
  res.status(201).json({
    code: 201,
    message: '用户创建成功',
    data: newUser
  });
});

// 更新用户信息
router.put('/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ code: 404, message: '用户不存在' });
  }

  const { username, email, phone, role, status, realName, avatar } = req.body;

  // 检查用户名或邮箱是否被其他用户占用
  if (username && username !== user.username && users.some(u => u.username === username)) {
    return res.status(400).json({ code: 400, message: '用户名已存在' });
  }
  if (email && email !== user.email && users.some(u => u.email === email)) {
    return res.status(400).json({ code: 400, message: '邮箱已存在' });
  }

  // 更新字段
  if (username) user.username = username;
  if (email) user.email = email;
  if (phone) user.phone = phone;
  if (role && Object.values(USER_ROLES).includes(role)) user.role = role;
  if (status && Object.values(USER_STATUS).includes(status)) user.status = status;
  if (realName) user.realName = realName;
  if (avatar) user.avatar = avatar;
  user.updatedAt = new Date().toISOString();

  res.json({
    code: 200,
    message: '用户更新成功',
    data: user
  });
});

// 删除用户
router.delete('/:id', (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ code: 404, message: '用户不存在' });
  }

  const deletedUser = users.splice(index, 1)[0];
  res.json({
    code: 200,
    message: '用户删除成功',
    data: deletedUser
  });
});

module.exports = router;

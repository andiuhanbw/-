// src/mock/handlers.js
import Mock from 'mockjs';

Mock.mock(/\/mock\/upload/, 'post', {
  code: 200,
  data: {
    url: Mock.Random.image('200x200', '#50B347', '#FFF', 'MockImg'),
  },
});

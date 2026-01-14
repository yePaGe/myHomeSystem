export const BusinessErrorCodes = {
  // 10xxxx: 通用/系统级错误
  COMMON_PARAM_ERROR: 100001, // 参数错误
  COMMON_RECORD_NOT_FOUND: 100404, // 记录未找到

  // 20xxxx: 用户与认证模块 (User & Auth)
  AUTH_ACCOUNT_EXISTS: 200001, // 账号已存在
  AUTH_PHONE_EXISTS: 200002, // 手机号已存在
  AUTH_ID_CARD_EXISTS: 200003, // 身份证已存在
  AUTH_LOGIN_FAILED: 200004, // 登录失败（账号或密码错误）
  AUTH_USER_NOT_FOUND: 200404, // 用户不存在
  AUTH_PASSWORD_INVALID: 200005, // 密码无效
  AUTH_MISSING_FIELDS: 200006, // 缺失必要字段

  // 30xxxx: 房源模块 (House)
  HOUSE_CODE_EXISTS: 300001, // 房源编号已存在

  // 40xxxx: 合同模块 (Contract)

  // 50xxxx: 财务模块 (Bill/Payment)
} as const;

export type BusinessErrorCodeType =
  (typeof BusinessErrorCodes)[keyof typeof BusinessErrorCodes];

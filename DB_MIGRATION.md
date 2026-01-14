## 数据库 Schema 变更操作指南

本项目使用 **Prisma** 管理数据库。任何对 `prisma/schema.prisma` 文件的修改，都需要通过 `migration` 同步到数据库。

### 1. 修改 Schema

编辑 `prisma/schema.prisma` 文件，根据需求新增或修改模型（Model）和字段。

**示例**：在 `User` 表中新增 `nickname` 字段
```prisma
model User {
  // ... 其他字段
  nickname String? // 新增字段
}
```

### 2. 生成并应用迁移 (Migration)

修改完成后，运行以下命令将变更同步到数据库：

```bash
npx prisma migrate dev --name <本次变更的描述>
```

**示例**：
```bash
npx prisma migrate dev --name add_nickname_to_user
```

该命令会自动执行以下操作：
1.  在 `prisma/migrations` 目录下生成一个新的 SQL 迁移文件。
2.  在数据库中执行该 SQL，更新表结构。
3.  重新生成 Prisma Client (`node_modules/@prisma/client`)，确保代码中有最新的类型定义。

---

### ⚠️ 注意：处理已有数据冲突 (Safe Migration)

如果你要新增一个 **必填 (Required)** 且 **唯一 (Unique)** 的字段（例如 `account String @unique`），而数据库中已经存在数据，直接迁移会失败。因为旧数据该字段为 `NULL`，违反了非空约束。

**安全操作步骤：**

1.  **第一步：先设为可选**
    修改 `schema.prisma`，暂时将该字段设为 **可选** (`?`)。
    ```prisma
    account String? @unique
    ```
    运行迁移：`npx prisma migrate dev --name add_account_optional`

2.  **第二步：回填数据**
    编写脚本或手动更新数据库，为所有旧数据填充该字段的值。
    *   *提示：可以使用 `prisma studio` 可视化工具进行手动修改，或者编写临时脚本。*

3.  **第三步：改为必填**
    确认所有数据都已有值后，再次修改 `schema.prisma`，将字段改为 **必填**。
    ```prisma
    account String @unique
    ```
    运行迁移：`npx prisma migrate dev --name make_account_required`

这样可以确保数据平滑过渡，不会丢失原有数据。

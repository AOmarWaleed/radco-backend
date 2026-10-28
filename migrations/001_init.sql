-- 1. Create Users and Roles first (without audit FKs)
CREATE TABLE IF NOT EXISTS roles (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by BIGINT,
  modification_at TIMESTAMPTZ,
  modification_by BIGINT
);

CREATE TABLE IF NOT EXISTS permissions (
  id BIGSERIAL PRIMARY KEY,
  key VARCHAR(100) NOT NULL UNIQUE,
  description VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by BIGINT,
  modification_at TIMESTAMPTZ,
  modification_by BIGINT
);

CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by BIGINT,
  modification_at TIMESTAMPTZ,
  modification_by BIGINT
);

-- 2. Create Role Permissions
CREATE TABLE IF NOT EXISTS role_permissions (
  role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id BIGINT NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by BIGINT,
  modification_at TIMESTAMPTZ,
  modification_by BIGINT,
  PRIMARY KEY (role_id, permission_id)
);

-- 3. Create Master Data Tables
CREATE TABLE IF NOT EXISTS item_code (
  id BIGSERIAL PRIMARY KEY,
  code VARCHAR(32) NOT NULL UNIQUE,
  name_ar VARCHAR(255) NOT NULL,
  name_en VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by BIGINT,
  modification_at TIMESTAMPTZ,
  modification_by BIGINT
);

CREATE TABLE IF NOT EXISTS warehouses (
  id BIGSERIAL PRIMARY KEY,
  name_ar VARCHAR(255) NOT NULL,
  name_en VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by BIGINT,
  modification_at TIMESTAMPTZ,
  modification_by BIGINT
);

CREATE TABLE IF NOT EXISTS suppliers (
  id BIGSERIAL PRIMARY KEY,
  name_ar VARCHAR(255) NOT NULL,
  name_en VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  email VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by BIGINT,
  modification_at TIMESTAMPTZ,
  modification_by BIGINT
);

CREATE TABLE IF NOT EXISTS employees (
  id BIGSERIAL PRIMARY KEY,
  name_ar VARCHAR(255) NOT NULL,
  name_en VARCHAR(255) NOT NULL,
  employee_type VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by BIGINT,
  modification_at TIMESTAMPTZ,
  modification_by BIGINT
);

-- 4. Create Items Table
CREATE TABLE IF NOT EXISTS items (
  item_id BIGSERIAL PRIMARY KEY,
  item_code_id BIGINT NOT NULL REFERENCES item_code(id) ON DELETE RESTRICT,
  unit VARCHAR(50),
  quantity NUMERIC(12,3) NOT NULL DEFAULT 0,
  warehouse_id BIGINT REFERENCES warehouses(id) ON DELETE SET NULL,
  employee_id BIGINT REFERENCES employees(id) ON DELETE SET NULL,
  supplier_id BIGINT REFERENCES suppliers(id) ON DELETE SET NULL,
  installation_site VARCHAR(255),
  action_type VARCHAR(50) NOT NULL,
  action_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by BIGINT,
  modification_at TIMESTAMPTZ,
  modification_by BIGINT
);

-- 5. Add Foreign Keys for Audit Columns (After all tables are created)
ALTER TABLE roles ADD CONSTRAINT fk_roles_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE roles ADD CONSTRAINT fk_roles_mod_by FOREIGN KEY (modification_by) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE permissions ADD CONSTRAINT fk_permissions_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE permissions ADD CONSTRAINT fk_permissions_mod_by FOREIGN KEY (modification_by) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE role_permissions ADD CONSTRAINT fk_role_perms_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE role_permissions ADD CONSTRAINT fk_role_perms_mod_by FOREIGN KEY (modification_by) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE users ADD CONSTRAINT fk_users_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE users ADD CONSTRAINT fk_users_mod_by FOREIGN KEY (modification_by) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE item_code ADD CONSTRAINT fk_item_code_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE item_code ADD CONSTRAINT fk_item_code_mod_by FOREIGN KEY (modification_by) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE warehouses ADD CONSTRAINT fk_warehouses_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE warehouses ADD CONSTRAINT fk_warehouses_mod_by FOREIGN KEY (modification_by) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE suppliers ADD CONSTRAINT fk_suppliers_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE suppliers ADD CONSTRAINT fk_suppliers_mod_by FOREIGN KEY (modification_by) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE employees ADD CONSTRAINT fk_employees_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE employees ADD CONSTRAINT fk_employees_mod_by FOREIGN KEY (modification_by) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE items ADD CONSTRAINT fk_items_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE items ADD CONSTRAINT fk_items_mod_by FOREIGN KEY (modification_by) REFERENCES users(id) ON DELETE SET NULL;
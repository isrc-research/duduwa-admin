-- Create the household_cbs table if it doesn't exist
CREATE TABLE IF NOT EXISTS household_cbs (
  id VARCHAR(48) PRIMARY KEY NOT NULL,
  ward_no INTEGER,
  total_households INTEGER,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP
);

-- Clear existing data (optional)
-- TRUNCATE TABLE household_cbs;

-- Create the household_cbs table if it doesn't exist
CREATE TABLE IF NOT EXISTS household_cbs (
  id VARCHAR(48) PRIMARY KEY NOT NULL,
  ward_no INTEGER,
  total_households INTEGER,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP
);

-- Clear existing data (optional)
-- TRUNCATE TABLE household_cbs;

-- Insert ward-wise household data
INSERT INTO household_cbs (id, ward_no, total_households, created_at) 
VALUES 
  ('house_ward_1', 1, 1065, NOW()),
  ('house_ward_2', 2, 1588, NOW()),
  ('house_ward_3', 3, 1368, NOW()),
  ('house_ward_4', 4, 952, NOW()),
  ('house_ward_5', 5, 1569, NOW()),
  ('house_ward_6', 6, 1509, NOW());

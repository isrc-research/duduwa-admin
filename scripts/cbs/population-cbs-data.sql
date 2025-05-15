-- Create the population_gender_wise_cbs table if it doesn't exist
CREATE TABLE IF NOT EXISTS population_gender_wise_cbs (
  id VARCHAR(48) PRIMARY KEY NOT NULL,
  ward_no INTEGER,
  total_population INTEGER,
  total_male INTEGER,
  total_female INTEGER
);

-- Clear existing data (optional)
-- TRUNCATE TABLE population_gender_wise_cbs;

-- Insert ward-wise population data
INSERT INTO population_gender_wise_cbs (id, ward_no, total_population, total_male, total_female)
VALUES 
  ('pop_ward_1', 1, 5872, 2989, 2883),
  ('pop_ward_2', 2, 9226, 4722, 4504),
  ('pop_ward_3', 3, 7638, 3920, 3718),
  ('pop_ward_4', 4, 5261, 2701, 2560),
  ('pop_ward_5', 5, 6680, 3074, 3606),
  ('pop_ward_6', 6, 8458, 4426, 4032);
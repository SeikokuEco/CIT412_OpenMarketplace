CREATE TABLE `cit412-final-project-494116.marketplace.listings` (
  listing_id    STRING NOT NULL,
  user_id       STRING NOT NULL,
  title         STRING,
  description   STRING,
  price         FLOAT64,
  category      STRING,
  condition     STRING,
  status        STRING,
  latitude      FLOAT64,
  longitude     FLOAT64,
  image_url     STRING,
  created_at    TIMESTAMP
);

CREATE TABLE `cit412-final-project-494116.marketplace.users` (
  user_id       STRING NOT NULL,
  email         STRING,
  display_name  STRING,
  created_at    TIMESTAMP
);
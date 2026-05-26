CREATE TABLE IF NOT EXISTS entries (
  id TEXT PRIMARY KEY,
  data TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS keys (
  key TEXT PRIMARY KEY,
  holder TEXT NOT NULL
);

INSERT OR IGNORE INTO keys (key, holder) VALUES ('dao-you-ling-001', '掌令使');
INSERT OR IGNORE INTO keys (key, holder) VALUES ('dao-you-ling-002', '副令使');
INSERT OR IGNORE INTO keys (key, holder) VALUES ('dao-you-ling-003', '巡山使');

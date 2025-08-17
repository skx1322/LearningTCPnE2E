-- type for users/messages
CREATE TYPE user_role AS ENUM ('user', 'admin');
CREATE TYPE message_status AS ENUM ('sent', 'delivered', 'read');

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE users (
    userID VARCHAR(36) PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_public_keys (
    key_id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL UNIQUE,
    public_key TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(userID) ON DELETE CASCADE
);

CREATE TABLE messages (
    message_id VARCHAR(36) PRIMARY KEY,
    sender_id VARCHAR(36) NOT NULL,
    encrypted_content TEXT NOT NULL,
    content_type VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(userID) ON DELETE CASCADE
);

CREATE TABLE message_receipts (
    receipt_id VARCHAR(36) PRIMARY KEY,
    message_id VARCHAR(36) NOT NULL,
    recipient_id VARCHAR(36) NOT NULL,
    encrypted_for_recipient_content TEXT,
    status message_status DEFAULT 'sent',
    FOREIGN KEY (message_id) REFERENCES messages(message_id) ON DELETE CASCADE,
    FOREIGN KEY (recipient_id) REFERENCES users(userID) ON DELETE CASCADE
);

CREATE TABLE chat_rooms (
    room_id VARCHAR(36) PRIMARY KEY,
    room_name VARCHAR(255) NOT NULL,
    created_by_user_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by_user_id) REFERENCES users(userID)
);

CREATE TABLE chat_participants (
    room_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    PRIMARY KEY (room_id, user_id),
    FOREIGN KEY (room_id) REFERENCES chat_rooms(room_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(userID) ON DELETE CASCADE
);
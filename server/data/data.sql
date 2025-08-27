CREATE TABLE users (
    user_id UUID PRIMARY KEY UNIQUE,
    username VARCHAR(50) NOT NULL UNIQUE,
    user_email VARCHAR(255) NOT NULL UNIQUE,
    hashed_password TEXT NOT NULL,
    user_avatar_url TEXT,
    public_key TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE chats (
    chat_id UUID PRIMARY KEY,
    chat_name VARCHAR(100) NOT NULL,
    creator_id UUID NOT NULL REFERENCES users(user_id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TYPE chat_role AS ENUM ('admin', 'member');

CREATE TABLE chat_members (
    chat_id UUID NOT NULL REFERENCES chats(chat_id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    role chat_role DEFAULT 'member',
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (chat_id, user_id)
);

CREATE TABLE messages (
    message_id UUID PRIMARY KEY UNIQUE,
    chat_id UUID NOT NULL REFERENCES chats(chat_id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(user_id),
    encrypted_content TEXT NOT NULL,
    nonce TEXT NOT NULL,
    auth_tag TEXT NOT NULL,
    sent_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_sent_at ON messages(chat_id, sent_at DESC);
# Be sure to restart your server when you modify this file.

# Your secret key is used for verifying the integrity of signed cookies.
# If you change this key, all old signed cookies will become invalid!

# Make sure the secret is at least 30 characters and all random,
# no regular words or you'll be exposed to dictionary attacks.
# You can use `rake secret` to generate a secure secret key.

# Make sure your secret_key_base is kept private
# if you're sharing your code publicly.
Task::Application.config.secret_key_base = '80040e106b1bb8d1c2b5d77bb22cb41c7cac7550860df4fa550ca49d996bfaaf4a19b1ab5e91b207107f1db81be1d58f3a7c3cebb94cc37289c40dafcac62fac'

CREATE TABLE "visits" (
	"id" serial PRIMARY KEY,
	"device_type" text NOT NULL,
	"user_agent" text,
	"visited_at" timestamp DEFAULT now()
);

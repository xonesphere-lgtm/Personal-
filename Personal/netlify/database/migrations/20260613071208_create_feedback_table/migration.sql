CREATE TABLE "feedback" (
	"id" serial PRIMARY KEY,
	"stars" integer NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);

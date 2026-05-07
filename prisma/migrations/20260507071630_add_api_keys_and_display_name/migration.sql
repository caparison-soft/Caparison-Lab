-- AlterTable
ALTER TABLE "users" ADD COLUMN     "display_name" TEXT;

-- CreateTable
CREATE TABLE "api_keys" (
    "id" TEXT NOT NULL,
    "app_id" TEXT NOT NULL,
    "key_hash" TEXT NOT NULL,
    "key_prefix" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "api_keys_key_hash_key" ON "api_keys"("key_hash");

-- AddForeignKey
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "apps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

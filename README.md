## 📚 Supabase Notes Upload & Processing API

This project is a **Python FastAPI backend** integrated with **Supabase Storage**, designed to allow authenticated users to upload and manage their own quiz-related documents (PDFs, Word files, etc.). It features:

* Secure, user-specific file uploads to Supabase Storage.
* Triggered storage event processing via PostgreSQL functions.
* Auto-extraction of file metadata (e.g., file name, user ID).
* Integration with Supabase Edge Functions for document processing.

---

## 🚀 Features

* 🔐 **User-Specific Storage Access**

  * Only authenticated users can upload, view, and manage their own files.
  * Supabase RLS (Row-Level Security) policies enforced at the bucket level.

* 📂 **Organized File Paths**

  * Files are stored under:

    ```
    /notes/{user_id}/{quiz_id}/{file_name}
    ```

* 🧠 **Smart Triggers**

  * A PostgreSQL trigger listens to new file uploads and inserts metadata into a `documents` table.
  * Automatically calls a Supabase Edge Function (`/functions/v1/process`) to handle the uploaded document.

* 🔄 **TypeScript-Compatible Frontend**

  * Works seamlessly with a frontend built in Vue, Nuxt, or any TypeScript framework.

---

## ⚙️ Tech Stack

| Layer      | Tool / Service                     |
| ---------- | ---------------------------------- |
| Backend    | Supabase                           |
| Storage    | Supabase Storage                   |
| DB Trigger | PostgreSQL Trigger with PL/pgSQL   |
| Auth       | Supabase Auth                      |
| Frontend   | (Optional) Vue 3 / Nuxt 3          |
| Processing | Supabase Edge Functions (optional) |

---

## 🛠️ Supabase Policies (Security)

To restrict all file access to the file owner, the following **RLS policies** are added to `storage.objects`:

```sql
-- SELECT
CREATE POLICY "Users can view their own files"
ON storage.objects
FOR SELECT
USING (user_id = auth.uid());

-- INSERT
CREATE POLICY "Users can insert files with their UID"
ON storage.objects
FOR INSERT
WITH CHECK (user_id = auth.uid());

-- UPDATE
CREATE POLICY "Users can update their own files"
ON storage.objects
FOR UPDATE
USING (user_id = auth.uid());

-- DELETE
CREATE POLICY "Users can delete their own files"
ON storage.objects
FOR DELETE
USING (user_id = auth.uid());
```

---

## ⚡ Database Trigger Logic

```sql
-- Trigger Function
CREATE FUNCTION private.handle_storage_update()
RETURNS trigger AS $$
DECLARE
  document_id bigint;
  result int;
BEGIN
  INSERT INTO documents (name, storage_object_id, created_by)
    VALUES (new.path_tokens[3], new.id, new.owner)
    RETURNING id INTO document_id;

  SELECT net.http_post(
    url := supabase_url() || '/functions/v1/process',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', current_setting('request.headers')::json->>'authorization'
    ),
    body := jsonb_build_object('document_id', document_id)
  )
  INTO result;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger Binding
CREATE TRIGGER on_file_upload
AFTER INSERT ON storage.objects
FOR EACH ROW
EXECUTE FUNCTION private.handle_storage_update();
```

---

## 📦 Upload API Example

**Python Backend Endpoint:**

```python
@app.get("/{uuid}/{quizId}")
def ai(uuid: str, quizId: int):
    names = getNames(uuid, quizId)
    names = [item["name"] for item in names]
    files = [getFiles(uuid, quizId, name) for name in names]
    return {"files": files}
```

---

## 🧪 Testing Upload (in JS/TS)

```ts
const { data, error } = await supabase.storage
  .from("notes")
  .upload(`${userId}/${quizId}/${file.name}`, file, {
    cacheControl: "3600",
    upsert: true,
  });
```

---

## 📁 Folder Structure (Storage)

```
/notes/
  └── {user_id}/
        └── {quiz_id}/
              ├── notes1.pdf
              ├── lecture2.docx
              └── summary.txt
```

---

## ✅ To-Do / Next Steps

* [ ] Add OCR or NLP to process uploaded content
* [ ] Display file previews in frontend
* [ ] Add download endpoint with signed URLs
* [ ] Rate-limit or size-limit uploads per user

---

## 🧠 Author

**Ali Elsayed**
Turkiye, Istanbul | [LinkedIn]([https://linkedin.com/in/nurettin-kartal](https://github.com/Asharp97)) | [GitHub](https://github.com/asharp97)


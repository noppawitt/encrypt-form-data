export function setupForm(el: HTMLFormElement) {
  el.addEventListener("submit", async function (e: SubmitEvent) {
    e.preventDefault();

    const form = new FormData(el);
    const boundary = "boundary";
    const blob = createCustomFormData(form, boundary);
    const arrayBuff = await blob.arrayBuffer();

    const encrypted = xor(new Uint8Array(arrayBuff), "secret");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: encrypted,
        headers: {
          "Content-Type": `multipart/form-data; boundary=${boundary}`,
        },
      });

      console.log(res.status);
    } catch (error) {
      console.error(error);
    }
  });
}

function xor(inputUint8Array: Uint8Array, keyString: string): Uint8Array {
  // Convert the key string to an array of bytes
  const keyBytes = new TextEncoder().encode(keyString);

  // Create a new Uint8Array to store the encrypted data
  const encryptedUint8Array = new Uint8Array(inputUint8Array.length);

  // Perform XOR encryption
  for (let i = 0; i < inputUint8Array.length; i++) {
    const inputByte = inputUint8Array[i];
    const keyByte = keyBytes[i % keyBytes.length];
    encryptedUint8Array[i] = inputByte ^ keyByte;
  }

  return encryptedUint8Array;
}

function createCustomFormData(formData: FormData, boundary: string): Blob {
  const parts: BlobPart[] | undefined = [];

  formData.forEach((value, key) => {
    const header = `--${boundary}\nContent-Disposition: form-data; name="${key}";`;
    const footer = "\n";
    parts.push(header);
    if (value instanceof Blob) {
      parts.push(` filename="${value.name}"\nContent-Type: ${value.type}\n\n`);
      parts.push(value);
    } else {
      parts.push(`\nContent-Type: text/plain\n\n`);
      parts.push(value.toString());
    }
    parts.push(footer);
  });

  parts.push(`--${boundary}--\n`);

  return new Blob(parts, { type: `multipart/form-data; boundary=${boundary}` });
}

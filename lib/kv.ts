export type Metadata = {
  uuid: string;
  filename: string;
  mimetype: string;
  size: number;
  createdAt: string;
};

const store = new Map<string, Metadata>();

export async function saveMetadata(uuid: string, data: Metadata) {
  store.set(uuid, data);
}

export async function getMetadata(uuid: string): Promise<Metadata | null> {
  return store.get(uuid) ?? null;
}

export async function deleteMetadata(uuid: string) {
  store.delete(uuid);
}

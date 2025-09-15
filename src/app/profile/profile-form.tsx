'use client'

import { uploadAvatar } from "@/api/users/upload-avatar";
import { UserContext } from "@/context/user-context";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext, useState } from "react";

export function ProfileForm() {
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const { userId } = useContext(UserContext)

  const { mutate: updateAvatar, isPending } = useMutation({
    mutationFn: (data: FormData) => uploadAvatar(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('user[avatar]', file)

    updateAvatar(formData);
  };


  return (
    <form onSubmit={handleUpload}>
      <input type="file" onChange={handleFileChange} />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Enviando...' : 'Fazer Upload'}
      </button>
    </form>
  )
}
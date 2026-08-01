import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

import type { Job } from "./jobs";
import { deleteJob, listJobs, saveJob } from "./jobs.functions";

const KEY = ["jobs"] as const;

export function useJobs() {
  const queryClient = useQueryClient();
  const fetchJobs = useServerFn(listJobs);
  const save = useServerFn(saveJob);
  const remove = useServerFn(deleteJob);

  const query = useQuery({
    queryKey: KEY,
    queryFn: () => fetchJobs() as Promise<Job[]>,
  });

  const saveMutation = useMutation({
    mutationFn: (job: Job) => save({ data: job }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
    onError: (error: Error) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => remove({ data: { id } }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
    onError: (error: Error) => toast.error(error.message),
  });

  return {
    jobs: query.data ?? [],
    ready: !query.isLoading,
    error: query.error as Error | null,
    upsert: (job: Job) => saveMutation.mutate(job),
    remove: (id: string) => deleteMutation.mutate(id),
  };
}

"use client";

import { issueSchema } from "@/app/createIssueSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Callout, TextField } from "@radix-ui/themes";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import ErrorMessage from "@/app/components/ErrorMessage";
import { Issue } from "@prisma/client";
import "easymde/dist/easymde.min.css";
import SimpleMDE from "react-simplemde-editor";
import Spinner from "@/app/components/Spinner";

type IssueFormData = z.infer<typeof issueSchema>;

const IssueForm = async ({
  issue,
  totalIssues,
}: {
  issue?: Issue;
  totalIssues: number;
}) => {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IssueFormData>({
    resolver: zodResolver(issueSchema),
  });
  const [error, setError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setIsSubmitting(true);
      if (issue) {
        await axios.patch("/api/issues/" + issue.id, data);
      } else {
        if (totalIssues < 50) {
          await axios.post("/api/issues", data);
        }
      }

      router.push("/issues/list");
      router.refresh();
    } catch (error) {
      setError("An unexpected error has occured. ");
      setIsSubmitting(false);
    }
  });

  return (
    <div className="max-w-xl">
      {error && (
        <Callout.Root color="red" className="mb-5">
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}

      <form className="max-w-xl space-y-3" onSubmit={onSubmit}>
        {/* <TextField.Root
          placeholder="Title"
          {...register("title")}
          defaultValue={issue?.title}
        ></TextField.Root> */}
        <TextField.Root>
          <TextField.Input
            defaultValue={issue?.title}
            placeholder="Title"
            {...register("title")}
          />
        </TextField.Root>
        <ErrorMessage>{errors.title?.message}</ErrorMessage>
        <Controller
          name="description"
          control={control}
          defaultValue={issue?.decription}
          render={({ field }) => (
            <SimpleMDE placeholder="Description" {...field} />
          )}
        />
        <ErrorMessage>{errors.description?.message}</ErrorMessage>
        <Button disabled={isSubmitting}>
          {issue ? "Update Issue" : "Submit New Issue"}{" "}
          {isSubmitting && <Spinner />}
        </Button>
      </form>
    </div>
  );
};

export default IssueForm;

"use client";

import { Status } from "@prisma/client";
import { Box, Heading, Select } from "@radix-ui/themes";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

const statuses: { label: string; value?: Status }[] = [
  { label: "All" },
  { label: "Open", value: "OPEN" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Closed", value: "CLOSED" },
];

const IssueStatusFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <Box>
      <Heading size="2" mb="2">
        Filter By Status:
      </Heading>
      <Box>
        <Select.Root
          defaultValue={searchParams.get("status") || ""}
          onValueChange={(status) => {
            const params = new URLSearchParams();
            if (status) params.append("status", status);
            if (searchParams.get("orderBy"))
              params.append("orderBy", searchParams.get("orderBy")!);

            const query = params.size ? "?" + params.toString() : "";
            router.push("/issues/list" + query);
          }}
        >
          <Select.Trigger style={{ width: 150 }} />
          <Select.Content>
            {statuses.map((status) => (
              <Select.Item key={status.value} value={status.value || ""}>
                {status.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </Box>
    </Box>
  );
};

export default IssueStatusFilter;

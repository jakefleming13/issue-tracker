"use client";

import { Status } from "@prisma/client";
import { Box, Heading, Select } from "@radix-ui/themes";
import React from "react";

const statuses: { label: string; value?: Status }[] = [
  { label: "All" },
  { label: "Open", value: "OPEN" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Closed", value: "CLOSED" },
];

const IssueStatusFilter = () => {
  return (
    <Box>
      <Heading size="2" mb="2">
        Filter By Status:
      </Heading>
      <Box>
        <Select.Root defaultValue="">
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

import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "@/service/axios";
import ENDPOINTS from "@/service/endpoint";
import { z } from "zod";

// get history

const fetchHistory = async () => {
  const { data } = await axiosInstance({
    method: "get",
    url: ENDPOINTS.HISTORY,
    headers: { "Content-Type": "application/json" },
  });
  const statusSchema = z.number().optional();
  const messageSchema = z.string().optional();
  const status = statusSchema.parse(data.status);
  const message = messageSchema.parse(data.message);

  
const dataSchema = z.object({
  _id: z.string(),
  feedUrl: z.string().url(),
  startedAt: z.string(),
  finishedAt: z.string().optional(),
  totalFetched: z.number(),
  newJobs: z.number(),
  updatedJobs: z.number(),
  failedJobs: z.array(
    z.object({
      externalJobId: z.string().optional(),
      reason: z.string().optional(),
    })
  ),
  __v: z.number().optional(),

});

const userData = z.array(dataSchema);
  const retData = userData.parse(data.data.data);
  return { status, message, data: retData,length:data.data.total };
};

const useHistory = () => {
  return useQuery({
    queryKey: ["useHistory"],
    queryFn: () => fetchHistory(),
  });
};




export {useHistory };
import { Factory } from "@/libs/shape/factory";
import { TopicOption } from "../models";

export async function getTopics(): Promise<TopicOption[]> {
  const service = Factory.getQuizService();

  return service.getTopics();
}
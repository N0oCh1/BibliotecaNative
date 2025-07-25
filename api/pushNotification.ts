import type { NotificationType } from "@/utils/types"

const URL_PUSH = "https://exp.host/--/api/v2/push/send"

const sendNotification = async(body:NotificationType) => {
  console.log(body)
  const res = await fetch(URL_PUSH, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body)
  }).then(res=>res.json()).then(data=>console.log(data))
}
export {sendNotification}
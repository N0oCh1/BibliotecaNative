import type { NotificationType } from "@/utils/types"

const URL_PUSH = "https://exp.host/--/api/v2/push/send"

const sendNotification = async(body:NotificationType) => {
  const newBody = {...body,android:{channelId:"default", groupId:"default", isGroupSummary:true}}
  console.log("Notificacion => ", newBody)
  await fetch(URL_PUSH, {
    method: "POST",
    headers: {
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newBody)
  }).then(res=>res.json()).then(data=>console.log(data))
}
export {sendNotification}
import { Inbox } from "@/components/webhooks/inbox";

export default async function WebhookInboxPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // key={id} forces a fresh Inbox instance (fresh state) if the id ever
  // changes via a client-side transition between two inbox URLs.
  return <Inbox key={id} id={id} />;
}

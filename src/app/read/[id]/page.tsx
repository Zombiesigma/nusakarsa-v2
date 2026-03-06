
import { ReadView } from '@/components/views/read-view';

export default function ReadPage({ params }: { params: { id: string } }) {
  return <ReadView bookId={params.id} />;
}

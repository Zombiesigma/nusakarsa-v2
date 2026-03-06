
import { EditorView } from '@/components/views/editor-view';

export default function EditorPage({ params }: { params: { id: string } }) {
  return <EditorView bookId={params.id} />;
}

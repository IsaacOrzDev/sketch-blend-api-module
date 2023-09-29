import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { AuthUser } from 'src/decorator/user';
import { DocumentGrpc } from 'src/proxy/document.grpc';

@Injectable()
export class DocumentService {
  constructor(private documentGrpc: DocumentGrpc) {}

  public async checkIsUserDocument(user: AuthUser, documentId: string) {
    if (!user.userId || !documentId) {
      return undefined;
    }

    const result = await firstValueFrom(
      this.documentGrpc.client.getDocument({
        id: documentId,
      }),
    );

    if (!result.record) {
      throw new Error('Not allowed');
    }

    const checking = user.userId === result.record.userId;
    if (!checking) {
      throw new Error('Not allowed');
    }

    return result;
  }
}

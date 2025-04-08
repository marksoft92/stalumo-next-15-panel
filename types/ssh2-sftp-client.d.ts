declare module "ssh2-sftp-client" {
  export default class SFTPClient {
    connect(config: {
      host: string;
      username: string;
      password: string;
    }): Promise<void>;
    put(buffer: Buffer, path: string): Promise<void>;
    end(): Promise<void>;
  }
}

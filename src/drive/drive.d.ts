export type DriveFileLinks = {
  webViewLink: string;
  webContentLink: string;
};

export type DriveFile = {
  fileId: string;
} & DriveFileLinks;

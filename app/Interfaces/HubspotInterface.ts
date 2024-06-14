interface ContactProperties {
    createdate: string;
    email: string;
    firstname: string;
    hs_object_id: string;
    lastmodifieddate: string;
    lastname: string;
}
  
export interface Contact {
    id: string;
    properties: ContactProperties;
    createdAt: string;
    updatedAt: string;
    archived: boolean;
}

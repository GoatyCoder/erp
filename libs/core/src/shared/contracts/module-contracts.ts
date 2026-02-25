export interface ModulePublicContracts {
  getById(id: string, tenantId: string): Promise<unknown>;
}

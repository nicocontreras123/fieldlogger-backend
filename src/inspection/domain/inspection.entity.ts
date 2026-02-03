export class Inspection {
  constructor(
    public readonly id: string,
    public readonly location: string,
    public readonly technician: string,
    public readonly findings: string,
    public readonly status: 'pending' | 'synced',
    public readonly createdAt: Date,
    public readonly syncedAt?: Date,
  ) {}

  static create(
    id: string,
    location: string,
    technician: string,
    findings: string,
  ): Inspection {
    return new Inspection(
      id,
      location,
      technician,
      findings,
      'pending',
      new Date(),
    );
  }

  markAsSynced(): Inspection {
    return new Inspection(
      this.id,
      this.location,
      this.technician,
      this.findings,
      'synced',
      this.createdAt,
      new Date(),
    );
  }

  toJSON() {
    return {
      id: this.id,
      location: this.location,
      technician: this.technician,
      findings: this.findings,
      status: this.status,
      createdAt: this.createdAt.toISOString(),
      syncedAt: this.syncedAt?.toISOString(),
    };
  }
}

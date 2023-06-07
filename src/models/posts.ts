
interface CreatorDTO {
  creatorId: string;
  name: string | null;
}
export interface postsDB {
  id: string;
  creator_id: string;
  content: string;
  likes: number;
  deslikes: number;
  created_at: string;
  updated_at: string;
}

export interface postsModel {
  id: string;
  content: string;
  likes: number;
  deslikes: number;
  createdAt: string;
  updatedAt: string;
  creator: CreatorDTO;
}

export class Posts {
  constructor(
    private id: string,
    private creatorId: string,
    private content: string,
    private likes: number,
    private deslikes: number,
    private createdAt: string,
    private updatedAt: string,
  ) {}

  public getId(): string {
    return this.id;
  }

  public setId(value: string): void {
    this.id = value;
  }

  public getCreatorId(): string {
    return this.creatorId;
  }

  public setName(value: string): void {
    this.creatorId = value;
  }

  public getContent(): string {
    return this.content;
  }

  public setContent(value: string): void {
    this.content = value;
  }

  public getLikes(): number {
    return this.likes;
  }

  public setLikes(value: number): void {
    this.likes = value;
  }

  public getDeslikes(): number {
    return this.deslikes;
  }

  public setDeslikes(value: number): void {
    this.deslikes = value;
  }

  public getCreatedAt(): string {
    return this.createdAt;
  }

  public setUpdatedAt(value: string): void {
    this.createdAt = value;
  }

  public getUpdatedAt(): string {
    return this.updatedAt;
  }

  public setCreatedAt(value: string): void {
    this.updatedAt = value;
  }

  public toDBModel(): postsDB {
    return {
      id: this.id,
      creator_id: this.creatorId,
      content: this.content,
      likes: this.likes,
      deslikes: this.deslikes,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }

  public toBusinessModel(): postsModel {
    return {
      id: this.id,
      content: this.content,
      likes: this.likes,
      deslikes: this.deslikes,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      creator: {
        creatorId: this.creatorId,
        name: null,
      },
    };
  }
}

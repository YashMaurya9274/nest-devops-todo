import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Todo extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ default: false })
  completed: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);

TodoSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id.toString();
    delete (ret as any)._id;
  },
});

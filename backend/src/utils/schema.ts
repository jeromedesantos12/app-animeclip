export const WHERE_CLAUSE: any = {
  deleted_at: null,
};

export const AUTH_SELECT_FIELDS = {
  id: true,
  username: true,
  fullname: true,
  email: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
};

export const USER_SELECT_FIELDS = {
  id: true,
  username: true,
  fullname: true,
  email: true,
  avatar_url: true,
  bio: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
};

export const POST_SELECT_FIELDS = {
  id: true,
  title: true,
  image_url: true,
  episode_no: true,
  episode_title: true,
  clip_time: true,
  summary: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
  created_by: true,
  updated_by: true,
  deleted_by: true,
  author: {
    select: { id: true, username: true, fullname: true },
  },
  editor: {
    select: { id: true, username: true, fullname: true },
  },
  deleter: {
    select: { id: true, username: true, fullname: true },
  },
};

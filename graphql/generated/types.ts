import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  timestamptz: { input: any; output: any; }
  uuid: { input: any; output: any; }
};

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export type Int_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Int']['input']>;
  _gt?: InputMaybe<Scalars['Int']['input']>;
  _gte?: InputMaybe<Scalars['Int']['input']>;
  _in?: InputMaybe<Array<Scalars['Int']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['Int']['input']>;
  _lte?: InputMaybe<Scalars['Int']['input']>;
  _neq?: InputMaybe<Scalars['Int']['input']>;
  _nin?: InputMaybe<Array<Scalars['Int']['input']>>;
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['String']['input']>;
  _gt?: InputMaybe<Scalars['String']['input']>;
  _gte?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars['String']['input']>;
  _in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars['String']['input']>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars['String']['input']>;
  _lt?: InputMaybe<Scalars['String']['input']>;
  _lte?: InputMaybe<Scalars['String']['input']>;
  _neq?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars['String']['input']>;
  _nin?: InputMaybe<Array<Scalars['String']['input']>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars['String']['input']>;
};

/** AI Agent */
export type Agent = {
  __typename?: 'agent';
  avatar?: Maybe<Scalars['String']['output']>;
  created_at: Scalars['timestamptz']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  type_id?: Maybe<Scalars['Int']['output']>;
  updated_at: Scalars['timestamptz']['output'];
};

/** aggregated selection of "agent" */
export type Agent_Aggregate = {
  __typename?: 'agent_aggregate';
  aggregate?: Maybe<Agent_Aggregate_Fields>;
  nodes: Array<Agent>;
};

export type Agent_Aggregate_Bool_Exp = {
  count?: InputMaybe<Agent_Aggregate_Bool_Exp_Count>;
};

export type Agent_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Agent_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Agent_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "agent" */
export type Agent_Aggregate_Fields = {
  __typename?: 'agent_aggregate_fields';
  avg?: Maybe<Agent_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Agent_Max_Fields>;
  min?: Maybe<Agent_Min_Fields>;
  stddev?: Maybe<Agent_Stddev_Fields>;
  stddev_pop?: Maybe<Agent_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Agent_Stddev_Samp_Fields>;
  sum?: Maybe<Agent_Sum_Fields>;
  var_pop?: Maybe<Agent_Var_Pop_Fields>;
  var_samp?: Maybe<Agent_Var_Samp_Fields>;
  variance?: Maybe<Agent_Variance_Fields>;
};


/** aggregate fields of "agent" */
export type Agent_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Agent_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "agent" */
export type Agent_Aggregate_Order_By = {
  avg?: InputMaybe<Agent_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Agent_Max_Order_By>;
  min?: InputMaybe<Agent_Min_Order_By>;
  stddev?: InputMaybe<Agent_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Agent_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Agent_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Agent_Sum_Order_By>;
  var_pop?: InputMaybe<Agent_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Agent_Var_Samp_Order_By>;
  variance?: InputMaybe<Agent_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "agent" */
export type Agent_Arr_Rel_Insert_Input = {
  data: Array<Agent_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Agent_On_Conflict>;
};

/** aggregate avg on columns */
export type Agent_Avg_Fields = {
  __typename?: 'agent_avg_fields';
  id?: Maybe<Scalars['Float']['output']>;
  type_id?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "agent" */
export type Agent_Avg_Order_By = {
  id?: InputMaybe<Order_By>;
  type_id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "agent". All fields are combined with a logical 'AND'. */
export type Agent_Bool_Exp = {
  _and?: InputMaybe<Array<Agent_Bool_Exp>>;
  _not?: InputMaybe<Agent_Bool_Exp>;
  _or?: InputMaybe<Array<Agent_Bool_Exp>>;
  avatar?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  type_id?: InputMaybe<Int_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "agent" */
export enum Agent_Constraint {
  /** unique or primary key constraint on columns "id" */
  AgentPkey = 'agent_pkey'
}

/** input type for incrementing numeric columns in table "agent" */
export type Agent_Inc_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  type_id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "agent" */
export type Agent_Insert_Input = {
  avatar?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  type_id?: InputMaybe<Scalars['Int']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type Agent_Max_Fields = {
  __typename?: 'agent_max_fields';
  avatar?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  type_id?: Maybe<Scalars['Int']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by max() on columns of table "agent" */
export type Agent_Max_Order_By = {
  avatar?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  type_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Agent_Min_Fields = {
  __typename?: 'agent_min_fields';
  avatar?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  type_id?: Maybe<Scalars['Int']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by min() on columns of table "agent" */
export type Agent_Min_Order_By = {
  avatar?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  type_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "agent" */
export type Agent_Mutation_Response = {
  __typename?: 'agent_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Agent>;
};

/** on_conflict condition type for table "agent" */
export type Agent_On_Conflict = {
  constraint: Agent_Constraint;
  update_columns?: Array<Agent_Update_Column>;
  where?: InputMaybe<Agent_Bool_Exp>;
};

/** Ordering options when selecting data from "agent". */
export type Agent_Order_By = {
  avatar?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  type_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: agent */
export type Agent_Pk_Columns_Input = {
  id: Scalars['Int']['input'];
};

/** select columns of table "agent" */
export enum Agent_Select_Column {
  /** column name */
  Avatar = 'avatar',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  TypeId = 'type_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "agent" */
export type Agent_Set_Input = {
  avatar?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  type_id?: InputMaybe<Scalars['Int']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate stddev on columns */
export type Agent_Stddev_Fields = {
  __typename?: 'agent_stddev_fields';
  id?: Maybe<Scalars['Float']['output']>;
  type_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "agent" */
export type Agent_Stddev_Order_By = {
  id?: InputMaybe<Order_By>;
  type_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Agent_Stddev_Pop_Fields = {
  __typename?: 'agent_stddev_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
  type_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "agent" */
export type Agent_Stddev_Pop_Order_By = {
  id?: InputMaybe<Order_By>;
  type_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Agent_Stddev_Samp_Fields = {
  __typename?: 'agent_stddev_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
  type_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "agent" */
export type Agent_Stddev_Samp_Order_By = {
  id?: InputMaybe<Order_By>;
  type_id?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "agent" */
export type Agent_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Agent_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Agent_Stream_Cursor_Value_Input = {
  avatar?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  type_id?: InputMaybe<Scalars['Int']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate sum on columns */
export type Agent_Sum_Fields = {
  __typename?: 'agent_sum_fields';
  id?: Maybe<Scalars['Int']['output']>;
  type_id?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "agent" */
export type Agent_Sum_Order_By = {
  id?: InputMaybe<Order_By>;
  type_id?: InputMaybe<Order_By>;
};

/** Type of agent */
export type Agent_Type = {
  __typename?: 'agent_type';
  /** An array relationship */
  agents: Array<Agent>;
  /** An aggregate relationship */
  agents_aggregate: Agent_Aggregate;
  created_at: Scalars['timestamptz']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  updated_at: Scalars['timestamptz']['output'];
};


/** Type of agent */
export type Agent_TypeAgentsArgs = {
  distinct_on?: InputMaybe<Array<Agent_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Agent_Order_By>>;
  where?: InputMaybe<Agent_Bool_Exp>;
};


/** Type of agent */
export type Agent_TypeAgents_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Agent_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Agent_Order_By>>;
  where?: InputMaybe<Agent_Bool_Exp>;
};

/** aggregated selection of "agent_type" */
export type Agent_Type_Aggregate = {
  __typename?: 'agent_type_aggregate';
  aggregate?: Maybe<Agent_Type_Aggregate_Fields>;
  nodes: Array<Agent_Type>;
};

/** aggregate fields of "agent_type" */
export type Agent_Type_Aggregate_Fields = {
  __typename?: 'agent_type_aggregate_fields';
  avg?: Maybe<Agent_Type_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Agent_Type_Max_Fields>;
  min?: Maybe<Agent_Type_Min_Fields>;
  stddev?: Maybe<Agent_Type_Stddev_Fields>;
  stddev_pop?: Maybe<Agent_Type_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Agent_Type_Stddev_Samp_Fields>;
  sum?: Maybe<Agent_Type_Sum_Fields>;
  var_pop?: Maybe<Agent_Type_Var_Pop_Fields>;
  var_samp?: Maybe<Agent_Type_Var_Samp_Fields>;
  variance?: Maybe<Agent_Type_Variance_Fields>;
};


/** aggregate fields of "agent_type" */
export type Agent_Type_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Agent_Type_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Agent_Type_Avg_Fields = {
  __typename?: 'agent_type_avg_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "agent_type". All fields are combined with a logical 'AND'. */
export type Agent_Type_Bool_Exp = {
  _and?: InputMaybe<Array<Agent_Type_Bool_Exp>>;
  _not?: InputMaybe<Agent_Type_Bool_Exp>;
  _or?: InputMaybe<Array<Agent_Type_Bool_Exp>>;
  agents?: InputMaybe<Agent_Bool_Exp>;
  agents_aggregate?: InputMaybe<Agent_Aggregate_Bool_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "agent_type" */
export enum Agent_Type_Constraint {
  /** unique or primary key constraint on columns "id" */
  AgentTypePkey = 'agent_type_pkey'
}

/** input type for incrementing numeric columns in table "agent_type" */
export type Agent_Type_Inc_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "agent_type" */
export type Agent_Type_Insert_Input = {
  agents?: InputMaybe<Agent_Arr_Rel_Insert_Input>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type Agent_Type_Max_Fields = {
  __typename?: 'agent_type_max_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregate min on columns */
export type Agent_Type_Min_Fields = {
  __typename?: 'agent_type_min_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** response of any mutation on the table "agent_type" */
export type Agent_Type_Mutation_Response = {
  __typename?: 'agent_type_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Agent_Type>;
};

/** on_conflict condition type for table "agent_type" */
export type Agent_Type_On_Conflict = {
  constraint: Agent_Type_Constraint;
  update_columns?: Array<Agent_Type_Update_Column>;
  where?: InputMaybe<Agent_Type_Bool_Exp>;
};

/** Ordering options when selecting data from "agent_type". */
export type Agent_Type_Order_By = {
  agents_aggregate?: InputMaybe<Agent_Aggregate_Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: agent_type */
export type Agent_Type_Pk_Columns_Input = {
  id: Scalars['Int']['input'];
};

/** select columns of table "agent_type" */
export enum Agent_Type_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "agent_type" */
export type Agent_Type_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate stddev on columns */
export type Agent_Type_Stddev_Fields = {
  __typename?: 'agent_type_stddev_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Agent_Type_Stddev_Pop_Fields = {
  __typename?: 'agent_type_stddev_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Agent_Type_Stddev_Samp_Fields = {
  __typename?: 'agent_type_stddev_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "agent_type" */
export type Agent_Type_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Agent_Type_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Agent_Type_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate sum on columns */
export type Agent_Type_Sum_Fields = {
  __typename?: 'agent_type_sum_fields';
  id?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "agent_type" */
export enum Agent_Type_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Agent_Type_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Agent_Type_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Agent_Type_Set_Input>;
  /** filter the rows which have to be updated */
  where: Agent_Type_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Agent_Type_Var_Pop_Fields = {
  __typename?: 'agent_type_var_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Agent_Type_Var_Samp_Fields = {
  __typename?: 'agent_type_var_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Agent_Type_Variance_Fields = {
  __typename?: 'agent_type_variance_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** update columns of table "agent" */
export enum Agent_Update_Column {
  /** column name */
  Avatar = 'avatar',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  TypeId = 'type_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Agent_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Agent_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Agent_Set_Input>;
  /** filter the rows which have to be updated */
  where: Agent_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Agent_Var_Pop_Fields = {
  __typename?: 'agent_var_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
  type_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "agent" */
export type Agent_Var_Pop_Order_By = {
  id?: InputMaybe<Order_By>;
  type_id?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Agent_Var_Samp_Fields = {
  __typename?: 'agent_var_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
  type_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "agent" */
export type Agent_Var_Samp_Order_By = {
  id?: InputMaybe<Order_By>;
  type_id?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Agent_Variance_Fields = {
  __typename?: 'agent_variance_fields';
  id?: Maybe<Scalars['Float']['output']>;
  type_id?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "agent" */
export type Agent_Variance_Order_By = {
  id?: InputMaybe<Order_By>;
  type_id?: InputMaybe<Order_By>;
};

/** ordering argument of a cursor */
export enum Cursor_Ordering {
  /** ascending ordering of the cursor */
  Asc = 'ASC',
  /** descending ordering of the cursor */
  Desc = 'DESC'
}

/** mutation root */
export type Mutation_Root = {
  __typename?: 'mutation_root';
  /** delete data from the table: "agent" */
  delete_agent?: Maybe<Agent_Mutation_Response>;
  /** delete single row from the table: "agent" */
  delete_agent_by_pk?: Maybe<Agent>;
  /** delete data from the table: "agent_type" */
  delete_agent_type?: Maybe<Agent_Type_Mutation_Response>;
  /** delete single row from the table: "agent_type" */
  delete_agent_type_by_pk?: Maybe<Agent_Type>;
  /** delete data from the table: "topic_history" */
  delete_topic_history?: Maybe<Topic_History_Mutation_Response>;
  /** delete single row from the table: "topic_history" */
  delete_topic_history_by_pk?: Maybe<Topic_History>;
  /** insert data into the table: "agent" */
  insert_agent?: Maybe<Agent_Mutation_Response>;
  /** insert a single row into the table: "agent" */
  insert_agent_one?: Maybe<Agent>;
  /** insert data into the table: "agent_type" */
  insert_agent_type?: Maybe<Agent_Type_Mutation_Response>;
  /** insert a single row into the table: "agent_type" */
  insert_agent_type_one?: Maybe<Agent_Type>;
  /** insert data into the table: "topic_history" */
  insert_topic_history?: Maybe<Topic_History_Mutation_Response>;
  /** insert a single row into the table: "topic_history" */
  insert_topic_history_one?: Maybe<Topic_History>;
  /** update data of the table: "agent" */
  update_agent?: Maybe<Agent_Mutation_Response>;
  /** update single row of the table: "agent" */
  update_agent_by_pk?: Maybe<Agent>;
  /** update multiples rows of table: "agent" */
  update_agent_many?: Maybe<Array<Maybe<Agent_Mutation_Response>>>;
  /** update data of the table: "agent_type" */
  update_agent_type?: Maybe<Agent_Type_Mutation_Response>;
  /** update single row of the table: "agent_type" */
  update_agent_type_by_pk?: Maybe<Agent_Type>;
  /** update multiples rows of table: "agent_type" */
  update_agent_type_many?: Maybe<Array<Maybe<Agent_Type_Mutation_Response>>>;
  /** update data of the table: "topic_history" */
  update_topic_history?: Maybe<Topic_History_Mutation_Response>;
  /** update single row of the table: "topic_history" */
  update_topic_history_by_pk?: Maybe<Topic_History>;
  /** update multiples rows of table: "topic_history" */
  update_topic_history_many?: Maybe<Array<Maybe<Topic_History_Mutation_Response>>>;
};


/** mutation root */
export type Mutation_RootDelete_AgentArgs = {
  where: Agent_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Agent_By_PkArgs = {
  id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Agent_TypeArgs = {
  where: Agent_Type_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Agent_Type_By_PkArgs = {
  id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Topic_HistoryArgs = {
  where: Topic_History_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Topic_History_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootInsert_AgentArgs = {
  objects: Array<Agent_Insert_Input>;
  on_conflict?: InputMaybe<Agent_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Agent_OneArgs = {
  object: Agent_Insert_Input;
  on_conflict?: InputMaybe<Agent_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Agent_TypeArgs = {
  objects: Array<Agent_Type_Insert_Input>;
  on_conflict?: InputMaybe<Agent_Type_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Agent_Type_OneArgs = {
  object: Agent_Type_Insert_Input;
  on_conflict?: InputMaybe<Agent_Type_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Topic_HistoryArgs = {
  objects: Array<Topic_History_Insert_Input>;
  on_conflict?: InputMaybe<Topic_History_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Topic_History_OneArgs = {
  object: Topic_History_Insert_Input;
  on_conflict?: InputMaybe<Topic_History_On_Conflict>;
};


/** mutation root */
export type Mutation_RootUpdate_AgentArgs = {
  _inc?: InputMaybe<Agent_Inc_Input>;
  _set?: InputMaybe<Agent_Set_Input>;
  where: Agent_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Agent_By_PkArgs = {
  _inc?: InputMaybe<Agent_Inc_Input>;
  _set?: InputMaybe<Agent_Set_Input>;
  pk_columns: Agent_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Agent_ManyArgs = {
  updates: Array<Agent_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Agent_TypeArgs = {
  _inc?: InputMaybe<Agent_Type_Inc_Input>;
  _set?: InputMaybe<Agent_Type_Set_Input>;
  where: Agent_Type_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Agent_Type_By_PkArgs = {
  _inc?: InputMaybe<Agent_Type_Inc_Input>;
  _set?: InputMaybe<Agent_Type_Set_Input>;
  pk_columns: Agent_Type_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Agent_Type_ManyArgs = {
  updates: Array<Agent_Type_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Topic_HistoryArgs = {
  _inc?: InputMaybe<Topic_History_Inc_Input>;
  _set?: InputMaybe<Topic_History_Set_Input>;
  where: Topic_History_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Topic_History_By_PkArgs = {
  _inc?: InputMaybe<Topic_History_Inc_Input>;
  _set?: InputMaybe<Topic_History_Set_Input>;
  pk_columns: Topic_History_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Topic_History_ManyArgs = {
  updates: Array<Topic_History_Updates>;
};

/** column ordering options */
export enum Order_By {
  /** in ascending order, nulls last */
  Asc = 'asc',
  /** in ascending order, nulls first */
  AscNullsFirst = 'asc_nulls_first',
  /** in ascending order, nulls last */
  AscNullsLast = 'asc_nulls_last',
  /** in descending order, nulls first */
  Desc = 'desc',
  /** in descending order, nulls first */
  DescNullsFirst = 'desc_nulls_first',
  /** in descending order, nulls last */
  DescNullsLast = 'desc_nulls_last'
}

export type Query_Root = {
  __typename?: 'query_root';
  /** fetch data from the table: "agent" */
  agent: Array<Agent>;
  /** fetch aggregated fields from the table: "agent" */
  agent_aggregate: Agent_Aggregate;
  /** fetch data from the table: "agent" using primary key columns */
  agent_by_pk?: Maybe<Agent>;
  /** fetch data from the table: "agent_type" */
  agent_type: Array<Agent_Type>;
  /** fetch aggregated fields from the table: "agent_type" */
  agent_type_aggregate: Agent_Type_Aggregate;
  /** fetch data from the table: "agent_type" using primary key columns */
  agent_type_by_pk?: Maybe<Agent_Type>;
  /** fetch data from the table: "topic_history" */
  topic_history: Array<Topic_History>;
  /** fetch aggregated fields from the table: "topic_history" */
  topic_history_aggregate: Topic_History_Aggregate;
  /** fetch data from the table: "topic_history" using primary key columns */
  topic_history_by_pk?: Maybe<Topic_History>;
};


export type Query_RootAgentArgs = {
  distinct_on?: InputMaybe<Array<Agent_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Agent_Order_By>>;
  where?: InputMaybe<Agent_Bool_Exp>;
};


export type Query_RootAgent_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Agent_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Agent_Order_By>>;
  where?: InputMaybe<Agent_Bool_Exp>;
};


export type Query_RootAgent_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type Query_RootAgent_TypeArgs = {
  distinct_on?: InputMaybe<Array<Agent_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Agent_Type_Order_By>>;
  where?: InputMaybe<Agent_Type_Bool_Exp>;
};


export type Query_RootAgent_Type_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Agent_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Agent_Type_Order_By>>;
  where?: InputMaybe<Agent_Type_Bool_Exp>;
};


export type Query_RootAgent_Type_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type Query_RootTopic_HistoryArgs = {
  distinct_on?: InputMaybe<Array<Topic_History_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Topic_History_Order_By>>;
  where?: InputMaybe<Topic_History_Bool_Exp>;
};


export type Query_RootTopic_History_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Topic_History_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Topic_History_Order_By>>;
  where?: InputMaybe<Topic_History_Bool_Exp>;
};


export type Query_RootTopic_History_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Subscription_Root = {
  __typename?: 'subscription_root';
  /** fetch data from the table: "agent" */
  agent: Array<Agent>;
  /** fetch aggregated fields from the table: "agent" */
  agent_aggregate: Agent_Aggregate;
  /** fetch data from the table: "agent" using primary key columns */
  agent_by_pk?: Maybe<Agent>;
  /** fetch data from the table in a streaming manner: "agent" */
  agent_stream: Array<Agent>;
  /** fetch data from the table: "agent_type" */
  agent_type: Array<Agent_Type>;
  /** fetch aggregated fields from the table: "agent_type" */
  agent_type_aggregate: Agent_Type_Aggregate;
  /** fetch data from the table: "agent_type" using primary key columns */
  agent_type_by_pk?: Maybe<Agent_Type>;
  /** fetch data from the table in a streaming manner: "agent_type" */
  agent_type_stream: Array<Agent_Type>;
  /** fetch data from the table: "topic_history" */
  topic_history: Array<Topic_History>;
  /** fetch aggregated fields from the table: "topic_history" */
  topic_history_aggregate: Topic_History_Aggregate;
  /** fetch data from the table: "topic_history" using primary key columns */
  topic_history_by_pk?: Maybe<Topic_History>;
  /** fetch data from the table in a streaming manner: "topic_history" */
  topic_history_stream: Array<Topic_History>;
};


export type Subscription_RootAgentArgs = {
  distinct_on?: InputMaybe<Array<Agent_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Agent_Order_By>>;
  where?: InputMaybe<Agent_Bool_Exp>;
};


export type Subscription_RootAgent_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Agent_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Agent_Order_By>>;
  where?: InputMaybe<Agent_Bool_Exp>;
};


export type Subscription_RootAgent_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type Subscription_RootAgent_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Agent_Stream_Cursor_Input>>;
  where?: InputMaybe<Agent_Bool_Exp>;
};


export type Subscription_RootAgent_TypeArgs = {
  distinct_on?: InputMaybe<Array<Agent_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Agent_Type_Order_By>>;
  where?: InputMaybe<Agent_Type_Bool_Exp>;
};


export type Subscription_RootAgent_Type_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Agent_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Agent_Type_Order_By>>;
  where?: InputMaybe<Agent_Type_Bool_Exp>;
};


export type Subscription_RootAgent_Type_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type Subscription_RootAgent_Type_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Agent_Type_Stream_Cursor_Input>>;
  where?: InputMaybe<Agent_Type_Bool_Exp>;
};


export type Subscription_RootTopic_HistoryArgs = {
  distinct_on?: InputMaybe<Array<Topic_History_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Topic_History_Order_By>>;
  where?: InputMaybe<Topic_History_Bool_Exp>;
};


export type Subscription_RootTopic_History_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Topic_History_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Topic_History_Order_By>>;
  where?: InputMaybe<Topic_History_Bool_Exp>;
};


export type Subscription_RootTopic_History_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootTopic_History_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Topic_History_Stream_Cursor_Input>>;
  where?: InputMaybe<Topic_History_Bool_Exp>;
};

/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
export type Timestamptz_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['timestamptz']['input']>;
  _gt?: InputMaybe<Scalars['timestamptz']['input']>;
  _gte?: InputMaybe<Scalars['timestamptz']['input']>;
  _in?: InputMaybe<Array<Scalars['timestamptz']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['timestamptz']['input']>;
  _lte?: InputMaybe<Scalars['timestamptz']['input']>;
  _neq?: InputMaybe<Scalars['timestamptz']['input']>;
  _nin?: InputMaybe<Array<Scalars['timestamptz']['input']>>;
};

/** topic_history */
export type Topic_History = {
  __typename?: 'topic_history';
  agent_id: Scalars['Int']['output'];
  created_at: Scalars['timestamptz']['output'];
  id: Scalars['uuid']['output'];
  title: Scalars['String']['output'];
  updated_at: Scalars['timestamptz']['output'];
  user_id: Scalars['String']['output'];
};

/** aggregated selection of "topic_history" */
export type Topic_History_Aggregate = {
  __typename?: 'topic_history_aggregate';
  aggregate?: Maybe<Topic_History_Aggregate_Fields>;
  nodes: Array<Topic_History>;
};

/** aggregate fields of "topic_history" */
export type Topic_History_Aggregate_Fields = {
  __typename?: 'topic_history_aggregate_fields';
  avg?: Maybe<Topic_History_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Topic_History_Max_Fields>;
  min?: Maybe<Topic_History_Min_Fields>;
  stddev?: Maybe<Topic_History_Stddev_Fields>;
  stddev_pop?: Maybe<Topic_History_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Topic_History_Stddev_Samp_Fields>;
  sum?: Maybe<Topic_History_Sum_Fields>;
  var_pop?: Maybe<Topic_History_Var_Pop_Fields>;
  var_samp?: Maybe<Topic_History_Var_Samp_Fields>;
  variance?: Maybe<Topic_History_Variance_Fields>;
};


/** aggregate fields of "topic_history" */
export type Topic_History_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Topic_History_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Topic_History_Avg_Fields = {
  __typename?: 'topic_history_avg_fields';
  agent_id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "topic_history". All fields are combined with a logical 'AND'. */
export type Topic_History_Bool_Exp = {
  _and?: InputMaybe<Array<Topic_History_Bool_Exp>>;
  _not?: InputMaybe<Topic_History_Bool_Exp>;
  _or?: InputMaybe<Array<Topic_History_Bool_Exp>>;
  agent_id?: InputMaybe<Int_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  title?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  user_id?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "topic_history" */
export enum Topic_History_Constraint {
  /** unique or primary key constraint on columns "id" */
  TopicHistoryPkey = 'topic_history_pkey'
}

/** input type for incrementing numeric columns in table "topic_history" */
export type Topic_History_Inc_Input = {
  agent_id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "topic_history" */
export type Topic_History_Insert_Input = {
  agent_id?: InputMaybe<Scalars['Int']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  user_id?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Topic_History_Max_Fields = {
  __typename?: 'topic_history_max_fields';
  agent_id?: Maybe<Scalars['Int']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  user_id?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Topic_History_Min_Fields = {
  __typename?: 'topic_history_min_fields';
  agent_id?: Maybe<Scalars['Int']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  user_id?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "topic_history" */
export type Topic_History_Mutation_Response = {
  __typename?: 'topic_history_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Topic_History>;
};

/** on_conflict condition type for table "topic_history" */
export type Topic_History_On_Conflict = {
  constraint: Topic_History_Constraint;
  update_columns?: Array<Topic_History_Update_Column>;
  where?: InputMaybe<Topic_History_Bool_Exp>;
};

/** Ordering options when selecting data from "topic_history". */
export type Topic_History_Order_By = {
  agent_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: topic_history */
export type Topic_History_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "topic_history" */
export enum Topic_History_Select_Column {
  /** column name */
  AgentId = 'agent_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  Title = 'title',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UserId = 'user_id'
}

/** input type for updating data in table "topic_history" */
export type Topic_History_Set_Input = {
  agent_id?: InputMaybe<Scalars['Int']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  user_id?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate stddev on columns */
export type Topic_History_Stddev_Fields = {
  __typename?: 'topic_history_stddev_fields';
  agent_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Topic_History_Stddev_Pop_Fields = {
  __typename?: 'topic_history_stddev_pop_fields';
  agent_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Topic_History_Stddev_Samp_Fields = {
  __typename?: 'topic_history_stddev_samp_fields';
  agent_id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "topic_history" */
export type Topic_History_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Topic_History_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Topic_History_Stream_Cursor_Value_Input = {
  agent_id?: InputMaybe<Scalars['Int']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  user_id?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type Topic_History_Sum_Fields = {
  __typename?: 'topic_history_sum_fields';
  agent_id?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "topic_history" */
export enum Topic_History_Update_Column {
  /** column name */
  AgentId = 'agent_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  Title = 'title',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UserId = 'user_id'
}

export type Topic_History_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Topic_History_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Topic_History_Set_Input>;
  /** filter the rows which have to be updated */
  where: Topic_History_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Topic_History_Var_Pop_Fields = {
  __typename?: 'topic_history_var_pop_fields';
  agent_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Topic_History_Var_Samp_Fields = {
  __typename?: 'topic_history_var_samp_fields';
  agent_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Topic_History_Variance_Fields = {
  __typename?: 'topic_history_variance_fields';
  agent_id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to compare columns of type "uuid". All fields are combined with logical 'AND'. */
export type Uuid_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['uuid']['input']>;
  _gt?: InputMaybe<Scalars['uuid']['input']>;
  _gte?: InputMaybe<Scalars['uuid']['input']>;
  _in?: InputMaybe<Array<Scalars['uuid']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['uuid']['input']>;
  _lte?: InputMaybe<Scalars['uuid']['input']>;
  _neq?: InputMaybe<Scalars['uuid']['input']>;
  _nin?: InputMaybe<Array<Scalars['uuid']['input']>>;
};

export type AddNewTopicMutationMutationVariables = Exact<{
  title?: InputMaybe<Scalars['String']['input']>;
  user_id?: InputMaybe<Scalars['String']['input']>;
  agent_id?: InputMaybe<Scalars['Int']['input']>;
}>;


export type AddNewTopicMutationMutation = { __typename?: 'mutation_root', insert_topic_history_one?: { __typename?: 'topic_history', id: any, title: string, agent_id: number, user_id: string } | null };

export type GetAgentListByTypeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAgentListByTypeQuery = { __typename?: 'query_root', agent_type: Array<{ __typename?: 'agent_type', id: number, name: string, agents: Array<{ __typename?: 'agent', id: number, name: string, description?: string | null, avatar?: string | null }> }> };

export type AgentByIdQueryVariables = Exact<{
  id?: InputMaybe<Scalars['Int']['input']>;
}>;


export type AgentByIdQuery = { __typename?: 'query_root', agent_by_pk?: { __typename?: 'agent', id: number, name: string, description?: string | null, avatar?: string | null } | null };


export const AddNewTopicMutationDocument = gql`
    mutation AddNewTopicMutation($title: String, $user_id: String, $agent_id: Int) {
  insert_topic_history_one(
    object: {title: $title, user_id: $user_id, agent_id: $agent_id}
  ) {
    id
    title
    agent_id
    user_id
  }
}
    `;
export type AddNewTopicMutationMutationFn = Apollo.MutationFunction<AddNewTopicMutationMutation, AddNewTopicMutationMutationVariables>;

/**
 * __useAddNewTopicMutationMutation__
 *
 * To run a mutation, you first call `useAddNewTopicMutationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddNewTopicMutationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addNewTopicMutationMutation, { data, loading, error }] = useAddNewTopicMutationMutation({
 *   variables: {
 *      title: // value for 'title'
 *      user_id: // value for 'user_id'
 *      agent_id: // value for 'agent_id'
 *   },
 * });
 */
export function useAddNewTopicMutationMutation(baseOptions?: Apollo.MutationHookOptions<AddNewTopicMutationMutation, AddNewTopicMutationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddNewTopicMutationMutation, AddNewTopicMutationMutationVariables>(AddNewTopicMutationDocument, options);
      }
export type AddNewTopicMutationMutationHookResult = ReturnType<typeof useAddNewTopicMutationMutation>;
export type AddNewTopicMutationMutationResult = Apollo.MutationResult<AddNewTopicMutationMutation>;
export type AddNewTopicMutationMutationOptions = Apollo.BaseMutationOptions<AddNewTopicMutationMutation, AddNewTopicMutationMutationVariables>;
export const GetAgentListByTypeDocument = gql`
    query GetAgentListByType {
  agent_type(where: {agents: {id: {_is_null: false}}}) {
    id
    name
    agents {
      id
      name
      description
      avatar
    }
  }
}
    `;

/**
 * __useGetAgentListByTypeQuery__
 *
 * To run a query within a React component, call `useGetAgentListByTypeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAgentListByTypeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAgentListByTypeQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAgentListByTypeQuery(baseOptions?: Apollo.QueryHookOptions<GetAgentListByTypeQuery, GetAgentListByTypeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAgentListByTypeQuery, GetAgentListByTypeQueryVariables>(GetAgentListByTypeDocument, options);
      }
export function useGetAgentListByTypeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAgentListByTypeQuery, GetAgentListByTypeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAgentListByTypeQuery, GetAgentListByTypeQueryVariables>(GetAgentListByTypeDocument, options);
        }
export function useGetAgentListByTypeSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetAgentListByTypeQuery, GetAgentListByTypeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAgentListByTypeQuery, GetAgentListByTypeQueryVariables>(GetAgentListByTypeDocument, options);
        }
export type GetAgentListByTypeQueryHookResult = ReturnType<typeof useGetAgentListByTypeQuery>;
export type GetAgentListByTypeLazyQueryHookResult = ReturnType<typeof useGetAgentListByTypeLazyQuery>;
export type GetAgentListByTypeSuspenseQueryHookResult = ReturnType<typeof useGetAgentListByTypeSuspenseQuery>;
export type GetAgentListByTypeQueryResult = Apollo.QueryResult<GetAgentListByTypeQuery, GetAgentListByTypeQueryVariables>;
export const AgentByIdDocument = gql`
    query AgentByID($id: Int = 10) {
  agent_by_pk(id: $id) {
    id
    name
    description
    avatar
  }
}
    `;

/**
 * __useAgentByIdQuery__
 *
 * To run a query within a React component, call `useAgentByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useAgentByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAgentByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useAgentByIdQuery(baseOptions?: Apollo.QueryHookOptions<AgentByIdQuery, AgentByIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AgentByIdQuery, AgentByIdQueryVariables>(AgentByIdDocument, options);
      }
export function useAgentByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AgentByIdQuery, AgentByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AgentByIdQuery, AgentByIdQueryVariables>(AgentByIdDocument, options);
        }
export function useAgentByIdSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<AgentByIdQuery, AgentByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AgentByIdQuery, AgentByIdQueryVariables>(AgentByIdDocument, options);
        }
export type AgentByIdQueryHookResult = ReturnType<typeof useAgentByIdQuery>;
export type AgentByIdLazyQueryHookResult = ReturnType<typeof useAgentByIdLazyQuery>;
export type AgentByIdSuspenseQueryHookResult = ReturnType<typeof useAgentByIdSuspenseQuery>;
export type AgentByIdQueryResult = Apollo.QueryResult<AgentByIdQuery, AgentByIdQueryVariables>;
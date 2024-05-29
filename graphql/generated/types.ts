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
  jsonb: { input: any; output: any; }
  timestamptz: { input: any; output: any; }
  uuid: { input: any; output: any; }
};

/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
export type Boolean_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Boolean']['input']>;
  _gt?: InputMaybe<Scalars['Boolean']['input']>;
  _gte?: InputMaybe<Scalars['Boolean']['input']>;
  _in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['Boolean']['input']>;
  _lte?: InputMaybe<Scalars['Boolean']['input']>;
  _neq?: InputMaybe<Scalars['Boolean']['input']>;
  _nin?: InputMaybe<Array<Scalars['Boolean']['input']>>;
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
export type String_Array_Comparison_Exp = {
  /** is the array contained in the given array value */
  _contained_in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** does the array contain the given value */
  _contains?: InputMaybe<Array<Scalars['String']['input']>>;
  _eq?: InputMaybe<Array<Scalars['String']['input']>>;
  _gt?: InputMaybe<Array<Scalars['String']['input']>>;
  _gte?: InputMaybe<Array<Scalars['String']['input']>>;
  _in?: InputMaybe<Array<Array<Scalars['String']['input']>>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Array<Scalars['String']['input']>>;
  _lte?: InputMaybe<Array<Scalars['String']['input']>>;
  _neq?: InputMaybe<Array<Scalars['String']['input']>>;
  _nin?: InputMaybe<Array<Array<Scalars['String']['input']>>>;
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

export type Jsonb_Cast_Exp = {
  String?: InputMaybe<String_Comparison_Exp>;
};

/** Boolean expression to compare columns of type "jsonb". All fields are combined with logical 'AND'. */
export type Jsonb_Comparison_Exp = {
  _cast?: InputMaybe<Jsonb_Cast_Exp>;
  /** is the column contained in the given json value */
  _contained_in?: InputMaybe<Scalars['jsonb']['input']>;
  /** does the column contain the given json value at the top level */
  _contains?: InputMaybe<Scalars['jsonb']['input']>;
  _eq?: InputMaybe<Scalars['jsonb']['input']>;
  _gt?: InputMaybe<Scalars['jsonb']['input']>;
  _gte?: InputMaybe<Scalars['jsonb']['input']>;
  /** does the string exist as a top-level key in the column */
  _has_key?: InputMaybe<Scalars['String']['input']>;
  /** do all of these strings exist as top-level keys in the column */
  _has_keys_all?: InputMaybe<Array<Scalars['String']['input']>>;
  /** do any of these strings exist as top-level keys in the column */
  _has_keys_any?: InputMaybe<Array<Scalars['String']['input']>>;
  _in?: InputMaybe<Array<Scalars['jsonb']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['jsonb']['input']>;
  _lte?: InputMaybe<Scalars['jsonb']['input']>;
  _neq?: InputMaybe<Scalars['jsonb']['input']>;
  _nin?: InputMaybe<Array<Scalars['jsonb']['input']>>;
};

/** message */
export type Message = {
  __typename?: 'message';
  content?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  feedback?: Maybe<Message_Feedback_Enum>;
  id: Scalars['uuid']['output'];
  role: Message_Role_Enum;
  session_id?: Maybe<Scalars['uuid']['output']>;
  status?: Maybe<Message_Status_Enum>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregated selection of "message" */
export type Message_Aggregate = {
  __typename?: 'message_aggregate';
  aggregate?: Maybe<Message_Aggregate_Fields>;
  nodes: Array<Message>;
};

/** aggregate fields of "message" */
export type Message_Aggregate_Fields = {
  __typename?: 'message_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Message_Max_Fields>;
  min?: Maybe<Message_Min_Fields>;
};


/** aggregate fields of "message" */
export type Message_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Message_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "message". All fields are combined with a logical 'AND'. */
export type Message_Bool_Exp = {
  _and?: InputMaybe<Array<Message_Bool_Exp>>;
  _not?: InputMaybe<Message_Bool_Exp>;
  _or?: InputMaybe<Array<Message_Bool_Exp>>;
  content?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  feedback?: InputMaybe<Message_Feedback_Enum_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  role?: InputMaybe<Message_Role_Enum_Comparison_Exp>;
  session_id?: InputMaybe<Uuid_Comparison_Exp>;
  status?: InputMaybe<Message_Status_Enum_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "message" */
export enum Message_Constraint {
  /** unique or primary key constraint on columns "id" */
  MessagePkey = 'message_pkey'
}

/** message_feedback */
export type Message_Feedback = {
  __typename?: 'message_feedback';
  comment: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

/** aggregated selection of "message_feedback" */
export type Message_Feedback_Aggregate = {
  __typename?: 'message_feedback_aggregate';
  aggregate?: Maybe<Message_Feedback_Aggregate_Fields>;
  nodes: Array<Message_Feedback>;
};

/** aggregate fields of "message_feedback" */
export type Message_Feedback_Aggregate_Fields = {
  __typename?: 'message_feedback_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Message_Feedback_Max_Fields>;
  min?: Maybe<Message_Feedback_Min_Fields>;
};


/** aggregate fields of "message_feedback" */
export type Message_Feedback_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Message_Feedback_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "message_feedback". All fields are combined with a logical 'AND'. */
export type Message_Feedback_Bool_Exp = {
  _and?: InputMaybe<Array<Message_Feedback_Bool_Exp>>;
  _not?: InputMaybe<Message_Feedback_Bool_Exp>;
  _or?: InputMaybe<Array<Message_Feedback_Bool_Exp>>;
  comment?: InputMaybe<String_Comparison_Exp>;
  value?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "message_feedback" */
export enum Message_Feedback_Constraint {
  /** unique or primary key constraint on columns "value" */
  MessageFeedbackPkey = 'message_feedback_pkey'
}

export enum Message_Feedback_Enum {
  /** dislike */
  Dislike = 'dislike',
  /** like */
  Like = 'like'
}

/** Boolean expression to compare columns of type "message_feedback_enum". All fields are combined with logical 'AND'. */
export type Message_Feedback_Enum_Comparison_Exp = {
  _eq?: InputMaybe<Message_Feedback_Enum>;
  _in?: InputMaybe<Array<Message_Feedback_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _neq?: InputMaybe<Message_Feedback_Enum>;
  _nin?: InputMaybe<Array<Message_Feedback_Enum>>;
};

/** input type for inserting data into table "message_feedback" */
export type Message_Feedback_Insert_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Message_Feedback_Max_Fields = {
  __typename?: 'message_feedback_max_fields';
  comment?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Message_Feedback_Min_Fields = {
  __typename?: 'message_feedback_min_fields';
  comment?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "message_feedback" */
export type Message_Feedback_Mutation_Response = {
  __typename?: 'message_feedback_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Message_Feedback>;
};

/** on_conflict condition type for table "message_feedback" */
export type Message_Feedback_On_Conflict = {
  constraint: Message_Feedback_Constraint;
  update_columns?: Array<Message_Feedback_Update_Column>;
  where?: InputMaybe<Message_Feedback_Bool_Exp>;
};

/** Ordering options when selecting data from "message_feedback". */
export type Message_Feedback_Order_By = {
  comment?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** primary key columns input for table: message_feedback */
export type Message_Feedback_Pk_Columns_Input = {
  value: Scalars['String']['input'];
};

/** select columns of table "message_feedback" */
export enum Message_Feedback_Select_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  Value = 'value'
}

/** input type for updating data in table "message_feedback" */
export type Message_Feedback_Set_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "message_feedback" */
export type Message_Feedback_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Message_Feedback_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Message_Feedback_Stream_Cursor_Value_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "message_feedback" */
export enum Message_Feedback_Update_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  Value = 'value'
}

export type Message_Feedback_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Message_Feedback_Set_Input>;
  /** filter the rows which have to be updated */
  where: Message_Feedback_Bool_Exp;
};

/** input type for inserting data into table "message" */
export type Message_Insert_Input = {
  content?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  feedback?: InputMaybe<Message_Feedback_Enum>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  role?: InputMaybe<Message_Role_Enum>;
  session_id?: InputMaybe<Scalars['uuid']['input']>;
  status?: InputMaybe<Message_Status_Enum>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type Message_Max_Fields = {
  __typename?: 'message_max_fields';
  content?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  session_id?: Maybe<Scalars['uuid']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregate min on columns */
export type Message_Min_Fields = {
  __typename?: 'message_min_fields';
  content?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  session_id?: Maybe<Scalars['uuid']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** response of any mutation on the table "message" */
export type Message_Mutation_Response = {
  __typename?: 'message_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Message>;
};

/** on_conflict condition type for table "message" */
export type Message_On_Conflict = {
  constraint: Message_Constraint;
  update_columns?: Array<Message_Update_Column>;
  where?: InputMaybe<Message_Bool_Exp>;
};

/** Ordering options when selecting data from "message". */
export type Message_Order_By = {
  content?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  feedback?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  role?: InputMaybe<Order_By>;
  session_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: message */
export type Message_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** message_role */
export type Message_Role = {
  __typename?: 'message_role';
  comment: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

/** aggregated selection of "message_role" */
export type Message_Role_Aggregate = {
  __typename?: 'message_role_aggregate';
  aggregate?: Maybe<Message_Role_Aggregate_Fields>;
  nodes: Array<Message_Role>;
};

/** aggregate fields of "message_role" */
export type Message_Role_Aggregate_Fields = {
  __typename?: 'message_role_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Message_Role_Max_Fields>;
  min?: Maybe<Message_Role_Min_Fields>;
};


/** aggregate fields of "message_role" */
export type Message_Role_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Message_Role_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "message_role". All fields are combined with a logical 'AND'. */
export type Message_Role_Bool_Exp = {
  _and?: InputMaybe<Array<Message_Role_Bool_Exp>>;
  _not?: InputMaybe<Message_Role_Bool_Exp>;
  _or?: InputMaybe<Array<Message_Role_Bool_Exp>>;
  comment?: InputMaybe<String_Comparison_Exp>;
  value?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "message_role" */
export enum Message_Role_Constraint {
  /** unique or primary key constraint on columns "value" */
  MessageRolePkey = 'message_role_pkey'
}

export enum Message_Role_Enum {
  /** assistant */
  Assistant = 'assistant',
  /** system */
  System = 'system',
  /** user */
  User = 'user'
}

/** Boolean expression to compare columns of type "message_role_enum". All fields are combined with logical 'AND'. */
export type Message_Role_Enum_Comparison_Exp = {
  _eq?: InputMaybe<Message_Role_Enum>;
  _in?: InputMaybe<Array<Message_Role_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _neq?: InputMaybe<Message_Role_Enum>;
  _nin?: InputMaybe<Array<Message_Role_Enum>>;
};

/** input type for inserting data into table "message_role" */
export type Message_Role_Insert_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Message_Role_Max_Fields = {
  __typename?: 'message_role_max_fields';
  comment?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Message_Role_Min_Fields = {
  __typename?: 'message_role_min_fields';
  comment?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "message_role" */
export type Message_Role_Mutation_Response = {
  __typename?: 'message_role_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Message_Role>;
};

/** on_conflict condition type for table "message_role" */
export type Message_Role_On_Conflict = {
  constraint: Message_Role_Constraint;
  update_columns?: Array<Message_Role_Update_Column>;
  where?: InputMaybe<Message_Role_Bool_Exp>;
};

/** Ordering options when selecting data from "message_role". */
export type Message_Role_Order_By = {
  comment?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** primary key columns input for table: message_role */
export type Message_Role_Pk_Columns_Input = {
  value: Scalars['String']['input'];
};

/** select columns of table "message_role" */
export enum Message_Role_Select_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  Value = 'value'
}

/** input type for updating data in table "message_role" */
export type Message_Role_Set_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "message_role" */
export type Message_Role_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Message_Role_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Message_Role_Stream_Cursor_Value_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "message_role" */
export enum Message_Role_Update_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  Value = 'value'
}

export type Message_Role_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Message_Role_Set_Input>;
  /** filter the rows which have to be updated */
  where: Message_Role_Bool_Exp;
};

/** select columns of table "message" */
export enum Message_Select_Column {
  /** column name */
  Content = 'content',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Feedback = 'feedback',
  /** column name */
  Id = 'id',
  /** column name */
  Role = 'role',
  /** column name */
  SessionId = 'session_id',
  /** column name */
  Status = 'status',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "message" */
export type Message_Set_Input = {
  content?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  feedback?: InputMaybe<Message_Feedback_Enum>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  role?: InputMaybe<Message_Role_Enum>;
  session_id?: InputMaybe<Scalars['uuid']['input']>;
  status?: InputMaybe<Message_Status_Enum>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** message_status */
export type Message_Status = {
  __typename?: 'message_status';
  comment: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

/** aggregated selection of "message_status" */
export type Message_Status_Aggregate = {
  __typename?: 'message_status_aggregate';
  aggregate?: Maybe<Message_Status_Aggregate_Fields>;
  nodes: Array<Message_Status>;
};

/** aggregate fields of "message_status" */
export type Message_Status_Aggregate_Fields = {
  __typename?: 'message_status_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Message_Status_Max_Fields>;
  min?: Maybe<Message_Status_Min_Fields>;
};


/** aggregate fields of "message_status" */
export type Message_Status_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Message_Status_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "message_status". All fields are combined with a logical 'AND'. */
export type Message_Status_Bool_Exp = {
  _and?: InputMaybe<Array<Message_Status_Bool_Exp>>;
  _not?: InputMaybe<Message_Status_Bool_Exp>;
  _or?: InputMaybe<Array<Message_Status_Bool_Exp>>;
  comment?: InputMaybe<String_Comparison_Exp>;
  value?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "message_status" */
export enum Message_Status_Constraint {
  /** unique or primary key constraint on columns "value" */
  MessageStatusPkey = 'message_status_pkey'
}

export enum Message_Status_Enum {
  /** failed */
  Failed = 'failed',
  /** success */
  Success = 'success'
}

/** Boolean expression to compare columns of type "message_status_enum". All fields are combined with logical 'AND'. */
export type Message_Status_Enum_Comparison_Exp = {
  _eq?: InputMaybe<Message_Status_Enum>;
  _in?: InputMaybe<Array<Message_Status_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _neq?: InputMaybe<Message_Status_Enum>;
  _nin?: InputMaybe<Array<Message_Status_Enum>>;
};

/** input type for inserting data into table "message_status" */
export type Message_Status_Insert_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Message_Status_Max_Fields = {
  __typename?: 'message_status_max_fields';
  comment?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Message_Status_Min_Fields = {
  __typename?: 'message_status_min_fields';
  comment?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "message_status" */
export type Message_Status_Mutation_Response = {
  __typename?: 'message_status_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Message_Status>;
};

/** on_conflict condition type for table "message_status" */
export type Message_Status_On_Conflict = {
  constraint: Message_Status_Constraint;
  update_columns?: Array<Message_Status_Update_Column>;
  where?: InputMaybe<Message_Status_Bool_Exp>;
};

/** Ordering options when selecting data from "message_status". */
export type Message_Status_Order_By = {
  comment?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** primary key columns input for table: message_status */
export type Message_Status_Pk_Columns_Input = {
  value: Scalars['String']['input'];
};

/** select columns of table "message_status" */
export enum Message_Status_Select_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  Value = 'value'
}

/** input type for updating data in table "message_status" */
export type Message_Status_Set_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "message_status" */
export type Message_Status_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Message_Status_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Message_Status_Stream_Cursor_Value_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "message_status" */
export enum Message_Status_Update_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  Value = 'value'
}

export type Message_Status_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Message_Status_Set_Input>;
  /** filter the rows which have to be updated */
  where: Message_Status_Bool_Exp;
};

/** Streaming cursor of the table "message" */
export type Message_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Message_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Message_Stream_Cursor_Value_Input = {
  content?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  feedback?: InputMaybe<Message_Feedback_Enum>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  role?: InputMaybe<Message_Role_Enum>;
  session_id?: InputMaybe<Scalars['uuid']['input']>;
  status?: InputMaybe<Message_Status_Enum>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** update columns of table "message" */
export enum Message_Update_Column {
  /** column name */
  Content = 'content',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Feedback = 'feedback',
  /** column name */
  Id = 'id',
  /** column name */
  Role = 'role',
  /** column name */
  SessionId = 'session_id',
  /** column name */
  Status = 'status',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Message_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Message_Set_Input>;
  /** filter the rows which have to be updated */
  where: Message_Bool_Exp;
};

/** multimodal_data */
export type Multimodal_Data = {
  __typename?: 'multimodal_data';
  bucket?: Maybe<Scalars['String']['output']>;
  content?: Maybe<Scalars['String']['output']>;
  end_time?: Maybe<Scalars['Int']['output']>;
  file_key?: Maybe<Scalars['String']['output']>;
  id: Scalars['uuid']['output'];
  is_chunk?: Maybe<Scalars['Boolean']['output']>;
  metadata?: Maybe<Scalars['jsonb']['output']>;
  start_time?: Maybe<Scalars['Int']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  topic?: Maybe<Array<Scalars['String']['output']>>;
  type: Scalars['String']['output'];
};


/** multimodal_data */
export type Multimodal_DataMetadataArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "multimodal_data" */
export type Multimodal_Data_Aggregate = {
  __typename?: 'multimodal_data_aggregate';
  aggregate?: Maybe<Multimodal_Data_Aggregate_Fields>;
  nodes: Array<Multimodal_Data>;
};

/** aggregate fields of "multimodal_data" */
export type Multimodal_Data_Aggregate_Fields = {
  __typename?: 'multimodal_data_aggregate_fields';
  avg?: Maybe<Multimodal_Data_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Multimodal_Data_Max_Fields>;
  min?: Maybe<Multimodal_Data_Min_Fields>;
  stddev?: Maybe<Multimodal_Data_Stddev_Fields>;
  stddev_pop?: Maybe<Multimodal_Data_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Multimodal_Data_Stddev_Samp_Fields>;
  sum?: Maybe<Multimodal_Data_Sum_Fields>;
  var_pop?: Maybe<Multimodal_Data_Var_Pop_Fields>;
  var_samp?: Maybe<Multimodal_Data_Var_Samp_Fields>;
  variance?: Maybe<Multimodal_Data_Variance_Fields>;
};


/** aggregate fields of "multimodal_data" */
export type Multimodal_Data_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Multimodal_Data_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Multimodal_Data_Append_Input = {
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
};

/** aggregate avg on columns */
export type Multimodal_Data_Avg_Fields = {
  __typename?: 'multimodal_data_avg_fields';
  end_time?: Maybe<Scalars['Float']['output']>;
  start_time?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "multimodal_data". All fields are combined with a logical 'AND'. */
export type Multimodal_Data_Bool_Exp = {
  _and?: InputMaybe<Array<Multimodal_Data_Bool_Exp>>;
  _not?: InputMaybe<Multimodal_Data_Bool_Exp>;
  _or?: InputMaybe<Array<Multimodal_Data_Bool_Exp>>;
  bucket?: InputMaybe<String_Comparison_Exp>;
  content?: InputMaybe<String_Comparison_Exp>;
  end_time?: InputMaybe<Int_Comparison_Exp>;
  file_key?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  is_chunk?: InputMaybe<Boolean_Comparison_Exp>;
  metadata?: InputMaybe<Jsonb_Comparison_Exp>;
  start_time?: InputMaybe<Int_Comparison_Exp>;
  title?: InputMaybe<String_Comparison_Exp>;
  topic?: InputMaybe<String_Array_Comparison_Exp>;
  type?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "multimodal_data" */
export enum Multimodal_Data_Constraint {
  /** unique or primary key constraint on columns "id" */
  MultimodalDataPkey = 'multimodal_data_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Multimodal_Data_Delete_At_Path_Input = {
  metadata?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Multimodal_Data_Delete_Elem_Input = {
  metadata?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Multimodal_Data_Delete_Key_Input = {
  metadata?: InputMaybe<Scalars['String']['input']>;
};

/** input type for incrementing numeric columns in table "multimodal_data" */
export type Multimodal_Data_Inc_Input = {
  end_time?: InputMaybe<Scalars['Int']['input']>;
  start_time?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "multimodal_data" */
export type Multimodal_Data_Insert_Input = {
  bucket?: InputMaybe<Scalars['String']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  end_time?: InputMaybe<Scalars['Int']['input']>;
  file_key?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  is_chunk?: InputMaybe<Scalars['Boolean']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  start_time?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  topic?: InputMaybe<Array<Scalars['String']['input']>>;
  type?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Multimodal_Data_Max_Fields = {
  __typename?: 'multimodal_data_max_fields';
  bucket?: Maybe<Scalars['String']['output']>;
  content?: Maybe<Scalars['String']['output']>;
  end_time?: Maybe<Scalars['Int']['output']>;
  file_key?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  start_time?: Maybe<Scalars['Int']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  topic?: Maybe<Array<Scalars['String']['output']>>;
  type?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Multimodal_Data_Min_Fields = {
  __typename?: 'multimodal_data_min_fields';
  bucket?: Maybe<Scalars['String']['output']>;
  content?: Maybe<Scalars['String']['output']>;
  end_time?: Maybe<Scalars['Int']['output']>;
  file_key?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  start_time?: Maybe<Scalars['Int']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  topic?: Maybe<Array<Scalars['String']['output']>>;
  type?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "multimodal_data" */
export type Multimodal_Data_Mutation_Response = {
  __typename?: 'multimodal_data_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Multimodal_Data>;
};

/** on_conflict condition type for table "multimodal_data" */
export type Multimodal_Data_On_Conflict = {
  constraint: Multimodal_Data_Constraint;
  update_columns?: Array<Multimodal_Data_Update_Column>;
  where?: InputMaybe<Multimodal_Data_Bool_Exp>;
};

/** Ordering options when selecting data from "multimodal_data". */
export type Multimodal_Data_Order_By = {
  bucket?: InputMaybe<Order_By>;
  content?: InputMaybe<Order_By>;
  end_time?: InputMaybe<Order_By>;
  file_key?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  is_chunk?: InputMaybe<Order_By>;
  metadata?: InputMaybe<Order_By>;
  start_time?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  topic?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
};

/** primary key columns input for table: multimodal_data */
export type Multimodal_Data_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Multimodal_Data_Prepend_Input = {
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "multimodal_data" */
export enum Multimodal_Data_Select_Column {
  /** column name */
  Bucket = 'bucket',
  /** column name */
  Content = 'content',
  /** column name */
  EndTime = 'end_time',
  /** column name */
  FileKey = 'file_key',
  /** column name */
  Id = 'id',
  /** column name */
  IsChunk = 'is_chunk',
  /** column name */
  Metadata = 'metadata',
  /** column name */
  StartTime = 'start_time',
  /** column name */
  Title = 'title',
  /** column name */
  Topic = 'topic',
  /** column name */
  Type = 'type'
}

/** input type for updating data in table "multimodal_data" */
export type Multimodal_Data_Set_Input = {
  bucket?: InputMaybe<Scalars['String']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  end_time?: InputMaybe<Scalars['Int']['input']>;
  file_key?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  is_chunk?: InputMaybe<Scalars['Boolean']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  start_time?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  topic?: InputMaybe<Array<Scalars['String']['input']>>;
  type?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate stddev on columns */
export type Multimodal_Data_Stddev_Fields = {
  __typename?: 'multimodal_data_stddev_fields';
  end_time?: Maybe<Scalars['Float']['output']>;
  start_time?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Multimodal_Data_Stddev_Pop_Fields = {
  __typename?: 'multimodal_data_stddev_pop_fields';
  end_time?: Maybe<Scalars['Float']['output']>;
  start_time?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Multimodal_Data_Stddev_Samp_Fields = {
  __typename?: 'multimodal_data_stddev_samp_fields';
  end_time?: Maybe<Scalars['Float']['output']>;
  start_time?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "multimodal_data" */
export type Multimodal_Data_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Multimodal_Data_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Multimodal_Data_Stream_Cursor_Value_Input = {
  bucket?: InputMaybe<Scalars['String']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  end_time?: InputMaybe<Scalars['Int']['input']>;
  file_key?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  is_chunk?: InputMaybe<Scalars['Boolean']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  start_time?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  topic?: InputMaybe<Array<Scalars['String']['input']>>;
  type?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type Multimodal_Data_Sum_Fields = {
  __typename?: 'multimodal_data_sum_fields';
  end_time?: Maybe<Scalars['Int']['output']>;
  start_time?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "multimodal_data" */
export enum Multimodal_Data_Update_Column {
  /** column name */
  Bucket = 'bucket',
  /** column name */
  Content = 'content',
  /** column name */
  EndTime = 'end_time',
  /** column name */
  FileKey = 'file_key',
  /** column name */
  Id = 'id',
  /** column name */
  IsChunk = 'is_chunk',
  /** column name */
  Metadata = 'metadata',
  /** column name */
  StartTime = 'start_time',
  /** column name */
  Title = 'title',
  /** column name */
  Topic = 'topic',
  /** column name */
  Type = 'type'
}

export type Multimodal_Data_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Multimodal_Data_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Multimodal_Data_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Multimodal_Data_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Multimodal_Data_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Multimodal_Data_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Multimodal_Data_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Multimodal_Data_Set_Input>;
  /** filter the rows which have to be updated */
  where: Multimodal_Data_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Multimodal_Data_Var_Pop_Fields = {
  __typename?: 'multimodal_data_var_pop_fields';
  end_time?: Maybe<Scalars['Float']['output']>;
  start_time?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Multimodal_Data_Var_Samp_Fields = {
  __typename?: 'multimodal_data_var_samp_fields';
  end_time?: Maybe<Scalars['Float']['output']>;
  start_time?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Multimodal_Data_Variance_Fields = {
  __typename?: 'multimodal_data_variance_fields';
  end_time?: Maybe<Scalars['Float']['output']>;
  start_time?: Maybe<Scalars['Float']['output']>;
};

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
  /** delete data from the table: "message" */
  delete_message?: Maybe<Message_Mutation_Response>;
  /** delete single row from the table: "message" */
  delete_message_by_pk?: Maybe<Message>;
  /** delete data from the table: "message_feedback" */
  delete_message_feedback?: Maybe<Message_Feedback_Mutation_Response>;
  /** delete single row from the table: "message_feedback" */
  delete_message_feedback_by_pk?: Maybe<Message_Feedback>;
  /** delete data from the table: "message_role" */
  delete_message_role?: Maybe<Message_Role_Mutation_Response>;
  /** delete single row from the table: "message_role" */
  delete_message_role_by_pk?: Maybe<Message_Role>;
  /** delete data from the table: "message_status" */
  delete_message_status?: Maybe<Message_Status_Mutation_Response>;
  /** delete single row from the table: "message_status" */
  delete_message_status_by_pk?: Maybe<Message_Status>;
  /** delete data from the table: "multimodal_data" */
  delete_multimodal_data?: Maybe<Multimodal_Data_Mutation_Response>;
  /** delete single row from the table: "multimodal_data" */
  delete_multimodal_data_by_pk?: Maybe<Multimodal_Data>;
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
  /** insert data into the table: "message" */
  insert_message?: Maybe<Message_Mutation_Response>;
  /** insert data into the table: "message_feedback" */
  insert_message_feedback?: Maybe<Message_Feedback_Mutation_Response>;
  /** insert a single row into the table: "message_feedback" */
  insert_message_feedback_one?: Maybe<Message_Feedback>;
  /** insert a single row into the table: "message" */
  insert_message_one?: Maybe<Message>;
  /** insert data into the table: "message_role" */
  insert_message_role?: Maybe<Message_Role_Mutation_Response>;
  /** insert a single row into the table: "message_role" */
  insert_message_role_one?: Maybe<Message_Role>;
  /** insert data into the table: "message_status" */
  insert_message_status?: Maybe<Message_Status_Mutation_Response>;
  /** insert a single row into the table: "message_status" */
  insert_message_status_one?: Maybe<Message_Status>;
  /** insert data into the table: "multimodal_data" */
  insert_multimodal_data?: Maybe<Multimodal_Data_Mutation_Response>;
  /** insert a single row into the table: "multimodal_data" */
  insert_multimodal_data_one?: Maybe<Multimodal_Data>;
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
  /** update data of the table: "message" */
  update_message?: Maybe<Message_Mutation_Response>;
  /** update single row of the table: "message" */
  update_message_by_pk?: Maybe<Message>;
  /** update data of the table: "message_feedback" */
  update_message_feedback?: Maybe<Message_Feedback_Mutation_Response>;
  /** update single row of the table: "message_feedback" */
  update_message_feedback_by_pk?: Maybe<Message_Feedback>;
  /** update multiples rows of table: "message_feedback" */
  update_message_feedback_many?: Maybe<Array<Maybe<Message_Feedback_Mutation_Response>>>;
  /** update multiples rows of table: "message" */
  update_message_many?: Maybe<Array<Maybe<Message_Mutation_Response>>>;
  /** update data of the table: "message_role" */
  update_message_role?: Maybe<Message_Role_Mutation_Response>;
  /** update single row of the table: "message_role" */
  update_message_role_by_pk?: Maybe<Message_Role>;
  /** update multiples rows of table: "message_role" */
  update_message_role_many?: Maybe<Array<Maybe<Message_Role_Mutation_Response>>>;
  /** update data of the table: "message_status" */
  update_message_status?: Maybe<Message_Status_Mutation_Response>;
  /** update single row of the table: "message_status" */
  update_message_status_by_pk?: Maybe<Message_Status>;
  /** update multiples rows of table: "message_status" */
  update_message_status_many?: Maybe<Array<Maybe<Message_Status_Mutation_Response>>>;
  /** update data of the table: "multimodal_data" */
  update_multimodal_data?: Maybe<Multimodal_Data_Mutation_Response>;
  /** update single row of the table: "multimodal_data" */
  update_multimodal_data_by_pk?: Maybe<Multimodal_Data>;
  /** update multiples rows of table: "multimodal_data" */
  update_multimodal_data_many?: Maybe<Array<Maybe<Multimodal_Data_Mutation_Response>>>;
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
export type Mutation_RootDelete_MessageArgs = {
  where: Message_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Message_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Message_FeedbackArgs = {
  where: Message_Feedback_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Message_Feedback_By_PkArgs = {
  value: Scalars['String']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Message_RoleArgs = {
  where: Message_Role_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Message_Role_By_PkArgs = {
  value: Scalars['String']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Message_StatusArgs = {
  where: Message_Status_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Message_Status_By_PkArgs = {
  value: Scalars['String']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Multimodal_DataArgs = {
  where: Multimodal_Data_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Multimodal_Data_By_PkArgs = {
  id: Scalars['uuid']['input'];
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
export type Mutation_RootInsert_MessageArgs = {
  objects: Array<Message_Insert_Input>;
  on_conflict?: InputMaybe<Message_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Message_FeedbackArgs = {
  objects: Array<Message_Feedback_Insert_Input>;
  on_conflict?: InputMaybe<Message_Feedback_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Message_Feedback_OneArgs = {
  object: Message_Feedback_Insert_Input;
  on_conflict?: InputMaybe<Message_Feedback_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Message_OneArgs = {
  object: Message_Insert_Input;
  on_conflict?: InputMaybe<Message_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Message_RoleArgs = {
  objects: Array<Message_Role_Insert_Input>;
  on_conflict?: InputMaybe<Message_Role_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Message_Role_OneArgs = {
  object: Message_Role_Insert_Input;
  on_conflict?: InputMaybe<Message_Role_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Message_StatusArgs = {
  objects: Array<Message_Status_Insert_Input>;
  on_conflict?: InputMaybe<Message_Status_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Message_Status_OneArgs = {
  object: Message_Status_Insert_Input;
  on_conflict?: InputMaybe<Message_Status_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Multimodal_DataArgs = {
  objects: Array<Multimodal_Data_Insert_Input>;
  on_conflict?: InputMaybe<Multimodal_Data_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Multimodal_Data_OneArgs = {
  object: Multimodal_Data_Insert_Input;
  on_conflict?: InputMaybe<Multimodal_Data_On_Conflict>;
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
export type Mutation_RootUpdate_MessageArgs = {
  _set?: InputMaybe<Message_Set_Input>;
  where: Message_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Message_By_PkArgs = {
  _set?: InputMaybe<Message_Set_Input>;
  pk_columns: Message_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Message_FeedbackArgs = {
  _set?: InputMaybe<Message_Feedback_Set_Input>;
  where: Message_Feedback_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Message_Feedback_By_PkArgs = {
  _set?: InputMaybe<Message_Feedback_Set_Input>;
  pk_columns: Message_Feedback_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Message_Feedback_ManyArgs = {
  updates: Array<Message_Feedback_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Message_ManyArgs = {
  updates: Array<Message_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Message_RoleArgs = {
  _set?: InputMaybe<Message_Role_Set_Input>;
  where: Message_Role_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Message_Role_By_PkArgs = {
  _set?: InputMaybe<Message_Role_Set_Input>;
  pk_columns: Message_Role_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Message_Role_ManyArgs = {
  updates: Array<Message_Role_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Message_StatusArgs = {
  _set?: InputMaybe<Message_Status_Set_Input>;
  where: Message_Status_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Message_Status_By_PkArgs = {
  _set?: InputMaybe<Message_Status_Set_Input>;
  pk_columns: Message_Status_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Message_Status_ManyArgs = {
  updates: Array<Message_Status_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Multimodal_DataArgs = {
  _append?: InputMaybe<Multimodal_Data_Append_Input>;
  _delete_at_path?: InputMaybe<Multimodal_Data_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Multimodal_Data_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Multimodal_Data_Delete_Key_Input>;
  _inc?: InputMaybe<Multimodal_Data_Inc_Input>;
  _prepend?: InputMaybe<Multimodal_Data_Prepend_Input>;
  _set?: InputMaybe<Multimodal_Data_Set_Input>;
  where: Multimodal_Data_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Multimodal_Data_By_PkArgs = {
  _append?: InputMaybe<Multimodal_Data_Append_Input>;
  _delete_at_path?: InputMaybe<Multimodal_Data_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Multimodal_Data_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Multimodal_Data_Delete_Key_Input>;
  _inc?: InputMaybe<Multimodal_Data_Inc_Input>;
  _prepend?: InputMaybe<Multimodal_Data_Prepend_Input>;
  _set?: InputMaybe<Multimodal_Data_Set_Input>;
  pk_columns: Multimodal_Data_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Multimodal_Data_ManyArgs = {
  updates: Array<Multimodal_Data_Updates>;
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
  /** fetch data from the table: "message" */
  message: Array<Message>;
  /** fetch aggregated fields from the table: "message" */
  message_aggregate: Message_Aggregate;
  /** fetch data from the table: "message" using primary key columns */
  message_by_pk?: Maybe<Message>;
  /** fetch data from the table: "message_feedback" */
  message_feedback: Array<Message_Feedback>;
  /** fetch aggregated fields from the table: "message_feedback" */
  message_feedback_aggregate: Message_Feedback_Aggregate;
  /** fetch data from the table: "message_feedback" using primary key columns */
  message_feedback_by_pk?: Maybe<Message_Feedback>;
  /** fetch data from the table: "message_role" */
  message_role: Array<Message_Role>;
  /** fetch aggregated fields from the table: "message_role" */
  message_role_aggregate: Message_Role_Aggregate;
  /** fetch data from the table: "message_role" using primary key columns */
  message_role_by_pk?: Maybe<Message_Role>;
  /** fetch data from the table: "message_status" */
  message_status: Array<Message_Status>;
  /** fetch aggregated fields from the table: "message_status" */
  message_status_aggregate: Message_Status_Aggregate;
  /** fetch data from the table: "message_status" using primary key columns */
  message_status_by_pk?: Maybe<Message_Status>;
  /** fetch data from the table: "multimodal_data" */
  multimodal_data: Array<Multimodal_Data>;
  /** fetch aggregated fields from the table: "multimodal_data" */
  multimodal_data_aggregate: Multimodal_Data_Aggregate;
  /** fetch data from the table: "multimodal_data" using primary key columns */
  multimodal_data_by_pk?: Maybe<Multimodal_Data>;
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


export type Query_RootMessageArgs = {
  distinct_on?: InputMaybe<Array<Message_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Message_Order_By>>;
  where?: InputMaybe<Message_Bool_Exp>;
};


export type Query_RootMessage_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Message_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Message_Order_By>>;
  where?: InputMaybe<Message_Bool_Exp>;
};


export type Query_RootMessage_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootMessage_FeedbackArgs = {
  distinct_on?: InputMaybe<Array<Message_Feedback_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Message_Feedback_Order_By>>;
  where?: InputMaybe<Message_Feedback_Bool_Exp>;
};


export type Query_RootMessage_Feedback_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Message_Feedback_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Message_Feedback_Order_By>>;
  where?: InputMaybe<Message_Feedback_Bool_Exp>;
};


export type Query_RootMessage_Feedback_By_PkArgs = {
  value: Scalars['String']['input'];
};


export type Query_RootMessage_RoleArgs = {
  distinct_on?: InputMaybe<Array<Message_Role_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Message_Role_Order_By>>;
  where?: InputMaybe<Message_Role_Bool_Exp>;
};


export type Query_RootMessage_Role_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Message_Role_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Message_Role_Order_By>>;
  where?: InputMaybe<Message_Role_Bool_Exp>;
};


export type Query_RootMessage_Role_By_PkArgs = {
  value: Scalars['String']['input'];
};


export type Query_RootMessage_StatusArgs = {
  distinct_on?: InputMaybe<Array<Message_Status_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Message_Status_Order_By>>;
  where?: InputMaybe<Message_Status_Bool_Exp>;
};


export type Query_RootMessage_Status_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Message_Status_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Message_Status_Order_By>>;
  where?: InputMaybe<Message_Status_Bool_Exp>;
};


export type Query_RootMessage_Status_By_PkArgs = {
  value: Scalars['String']['input'];
};


export type Query_RootMultimodal_DataArgs = {
  distinct_on?: InputMaybe<Array<Multimodal_Data_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Multimodal_Data_Order_By>>;
  where?: InputMaybe<Multimodal_Data_Bool_Exp>;
};


export type Query_RootMultimodal_Data_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Multimodal_Data_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Multimodal_Data_Order_By>>;
  where?: InputMaybe<Multimodal_Data_Bool_Exp>;
};


export type Query_RootMultimodal_Data_By_PkArgs = {
  id: Scalars['uuid']['input'];
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
  /** fetch data from the table: "message" */
  message: Array<Message>;
  /** fetch aggregated fields from the table: "message" */
  message_aggregate: Message_Aggregate;
  /** fetch data from the table: "message" using primary key columns */
  message_by_pk?: Maybe<Message>;
  /** fetch data from the table: "message_feedback" */
  message_feedback: Array<Message_Feedback>;
  /** fetch aggregated fields from the table: "message_feedback" */
  message_feedback_aggregate: Message_Feedback_Aggregate;
  /** fetch data from the table: "message_feedback" using primary key columns */
  message_feedback_by_pk?: Maybe<Message_Feedback>;
  /** fetch data from the table in a streaming manner: "message_feedback" */
  message_feedback_stream: Array<Message_Feedback>;
  /** fetch data from the table: "message_role" */
  message_role: Array<Message_Role>;
  /** fetch aggregated fields from the table: "message_role" */
  message_role_aggregate: Message_Role_Aggregate;
  /** fetch data from the table: "message_role" using primary key columns */
  message_role_by_pk?: Maybe<Message_Role>;
  /** fetch data from the table in a streaming manner: "message_role" */
  message_role_stream: Array<Message_Role>;
  /** fetch data from the table: "message_status" */
  message_status: Array<Message_Status>;
  /** fetch aggregated fields from the table: "message_status" */
  message_status_aggregate: Message_Status_Aggregate;
  /** fetch data from the table: "message_status" using primary key columns */
  message_status_by_pk?: Maybe<Message_Status>;
  /** fetch data from the table in a streaming manner: "message_status" */
  message_status_stream: Array<Message_Status>;
  /** fetch data from the table in a streaming manner: "message" */
  message_stream: Array<Message>;
  /** fetch data from the table: "multimodal_data" */
  multimodal_data: Array<Multimodal_Data>;
  /** fetch aggregated fields from the table: "multimodal_data" */
  multimodal_data_aggregate: Multimodal_Data_Aggregate;
  /** fetch data from the table: "multimodal_data" using primary key columns */
  multimodal_data_by_pk?: Maybe<Multimodal_Data>;
  /** fetch data from the table in a streaming manner: "multimodal_data" */
  multimodal_data_stream: Array<Multimodal_Data>;
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


export type Subscription_RootMessageArgs = {
  distinct_on?: InputMaybe<Array<Message_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Message_Order_By>>;
  where?: InputMaybe<Message_Bool_Exp>;
};


export type Subscription_RootMessage_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Message_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Message_Order_By>>;
  where?: InputMaybe<Message_Bool_Exp>;
};


export type Subscription_RootMessage_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootMessage_FeedbackArgs = {
  distinct_on?: InputMaybe<Array<Message_Feedback_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Message_Feedback_Order_By>>;
  where?: InputMaybe<Message_Feedback_Bool_Exp>;
};


export type Subscription_RootMessage_Feedback_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Message_Feedback_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Message_Feedback_Order_By>>;
  where?: InputMaybe<Message_Feedback_Bool_Exp>;
};


export type Subscription_RootMessage_Feedback_By_PkArgs = {
  value: Scalars['String']['input'];
};


export type Subscription_RootMessage_Feedback_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Message_Feedback_Stream_Cursor_Input>>;
  where?: InputMaybe<Message_Feedback_Bool_Exp>;
};


export type Subscription_RootMessage_RoleArgs = {
  distinct_on?: InputMaybe<Array<Message_Role_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Message_Role_Order_By>>;
  where?: InputMaybe<Message_Role_Bool_Exp>;
};


export type Subscription_RootMessage_Role_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Message_Role_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Message_Role_Order_By>>;
  where?: InputMaybe<Message_Role_Bool_Exp>;
};


export type Subscription_RootMessage_Role_By_PkArgs = {
  value: Scalars['String']['input'];
};


export type Subscription_RootMessage_Role_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Message_Role_Stream_Cursor_Input>>;
  where?: InputMaybe<Message_Role_Bool_Exp>;
};


export type Subscription_RootMessage_StatusArgs = {
  distinct_on?: InputMaybe<Array<Message_Status_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Message_Status_Order_By>>;
  where?: InputMaybe<Message_Status_Bool_Exp>;
};


export type Subscription_RootMessage_Status_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Message_Status_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Message_Status_Order_By>>;
  where?: InputMaybe<Message_Status_Bool_Exp>;
};


export type Subscription_RootMessage_Status_By_PkArgs = {
  value: Scalars['String']['input'];
};


export type Subscription_RootMessage_Status_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Message_Status_Stream_Cursor_Input>>;
  where?: InputMaybe<Message_Status_Bool_Exp>;
};


export type Subscription_RootMessage_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Message_Stream_Cursor_Input>>;
  where?: InputMaybe<Message_Bool_Exp>;
};


export type Subscription_RootMultimodal_DataArgs = {
  distinct_on?: InputMaybe<Array<Multimodal_Data_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Multimodal_Data_Order_By>>;
  where?: InputMaybe<Multimodal_Data_Bool_Exp>;
};


export type Subscription_RootMultimodal_Data_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Multimodal_Data_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Multimodal_Data_Order_By>>;
  where?: InputMaybe<Multimodal_Data_Bool_Exp>;
};


export type Subscription_RootMultimodal_Data_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootMultimodal_Data_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Multimodal_Data_Stream_Cursor_Input>>;
  where?: InputMaybe<Multimodal_Data_Bool_Exp>;
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

export type GetTopicHistoriesQueryVariables = Exact<{
  agent_id?: InputMaybe<Scalars['Int']['input']>;
  user_id?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetTopicHistoriesQuery = { __typename?: 'query_root', topic_history: Array<{ __typename?: 'topic_history', id: any, title: string, updated_at: any, user_id: string, created_at: any, agent_id: number }> };

export type GetAgentListByTypeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAgentListByTypeQuery = { __typename?: 'query_root', agent_type: Array<{ __typename?: 'agent_type', id: number, name: string, agents: Array<{ __typename?: 'agent', id: number, name: string, description?: string | null, avatar?: string | null }> }> };

export type AgentByIdQueryVariables = Exact<{
  id?: InputMaybe<Scalars['Int']['input']>;
}>;


export type AgentByIdQuery = { __typename?: 'query_root', agent_by_pk?: { __typename?: 'agent', id: number, name: string, description?: string | null, avatar?: string | null } | null };

export type GetMessageListSubscriptionVariables = Exact<{
  session_id?: InputMaybe<Scalars['uuid']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetMessageListSubscription = { __typename?: 'subscription_root', message: Array<{ __typename?: 'message', id: any, role: Message_Role_Enum, feedback?: Message_Feedback_Enum | null, created_at?: any | null, content?: string | null, status?: Message_Status_Enum | null, updated_at?: any | null }> };


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
export const GetTopicHistoriesDocument = gql`
    query GetTopicHistories($agent_id: Int = 10, $user_id: String = "", $limit: Int = 100) {
  topic_history(
    where: {agent_id: {_eq: $agent_id}, user_id: {_eq: $user_id}}
    order_by: {updated_at: desc_nulls_last}
    limit: $limit
  ) {
    id
    title
    updated_at
    user_id
    created_at
    agent_id
  }
}
    `;

/**
 * __useGetTopicHistoriesQuery__
 *
 * To run a query within a React component, call `useGetTopicHistoriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTopicHistoriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTopicHistoriesQuery({
 *   variables: {
 *      agent_id: // value for 'agent_id'
 *      user_id: // value for 'user_id'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetTopicHistoriesQuery(baseOptions?: Apollo.QueryHookOptions<GetTopicHistoriesQuery, GetTopicHistoriesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTopicHistoriesQuery, GetTopicHistoriesQueryVariables>(GetTopicHistoriesDocument, options);
      }
export function useGetTopicHistoriesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTopicHistoriesQuery, GetTopicHistoriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTopicHistoriesQuery, GetTopicHistoriesQueryVariables>(GetTopicHistoriesDocument, options);
        }
export function useGetTopicHistoriesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetTopicHistoriesQuery, GetTopicHistoriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTopicHistoriesQuery, GetTopicHistoriesQueryVariables>(GetTopicHistoriesDocument, options);
        }
export type GetTopicHistoriesQueryHookResult = ReturnType<typeof useGetTopicHistoriesQuery>;
export type GetTopicHistoriesLazyQueryHookResult = ReturnType<typeof useGetTopicHistoriesLazyQuery>;
export type GetTopicHistoriesSuspenseQueryHookResult = ReturnType<typeof useGetTopicHistoriesSuspenseQuery>;
export type GetTopicHistoriesQueryResult = Apollo.QueryResult<GetTopicHistoriesQuery, GetTopicHistoriesQueryVariables>;
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
export const GetMessageListDocument = gql`
    subscription GetMessageList($session_id: uuid, $limit: Int = 10) {
  message(where: {session_id: {_eq: $session_id}}, limit: $limit) {
    id
    role
    feedback
    created_at
    content
    status
    updated_at
  }
}
    `;

/**
 * __useGetMessageListSubscription__
 *
 * To run a query within a React component, call `useGetMessageListSubscription` and pass it any options that fit your needs.
 * When your component renders, `useGetMessageListSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMessageListSubscription({
 *   variables: {
 *      session_id: // value for 'session_id'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetMessageListSubscription(baseOptions?: Apollo.SubscriptionHookOptions<GetMessageListSubscription, GetMessageListSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<GetMessageListSubscription, GetMessageListSubscriptionVariables>(GetMessageListDocument, options);
      }
export type GetMessageListSubscriptionHookResult = ReturnType<typeof useGetMessageListSubscription>;
export type GetMessageListSubscriptionResult = Apollo.SubscriptionResult<GetMessageListSubscription>;
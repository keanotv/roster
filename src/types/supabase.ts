export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      config: {
        Row: {
          id: number
          isAutomaticCutOff: boolean
        }
        Insert: {
          id?: number
          isAutomaticCutOff?: boolean
        }
        Update: {
          id?: number
          isAutomaticCutOff?: boolean
        }
        Relationships: []
      }
      people: {
        Row: {
          active: boolean
          deleted: boolean
          id: number
          name: string
          server: boolean
        }
        Insert: {
          active?: boolean
          deleted?: boolean
          id?: number
          name: string
          server?: boolean
        }
        Update: {
          active?: boolean
          deleted?: boolean
          id?: number
          name?: string
          server?: boolean
        }
        Relationships: []
      }
      reason: {
        Row: {
          month: number
          people_id: number
          text: string | null
          year: number
        }
        Insert: {
          month: number
          people_id: number
          text?: string | null
          year: number
        }
        Update: {
          month?: number
          people_id?: number
          text?: string | null
          year?: number
        }
        Relationships: []
      }
      roles: {
        Row: {
          id: number
          roles: string
        }
        Insert: {
          id?: number
          roles?: string
        }
        Update: {
          id?: number
          roles?: string
        }
        Relationships: []
      }
      roster: {
        Row: {
          archived: boolean
          created_at: string
          date: string | null
          id: number
          published: boolean
          roster: string | null
          title: string
        }
        Insert: {
          archived?: boolean
          created_at?: string
          date?: string | null
          id?: number
          published?: boolean
          roster?: string | null
          title?: string
        }
        Update: {
          archived?: boolean
          created_at?: string
          date?: string | null
          id?: number
          published?: boolean
          roster?: string | null
          title?: string
        }
        Relationships: []
      }
      unavailability: {
        Row: {
          days: number[]
          month: number
          people_id: number
          reason: boolean
          year: number
        }
        Insert: {
          days: number[]
          month: number
          people_id: number
          reason?: boolean
          year: number
        }
        Update: {
          days?: number[]
          month?: number
          people_id?: number
          reason?: boolean
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: 'unavailability_people_id_fkey'
            columns: ['people_id']
            isOneToOne: false
            referencedRelation: 'people'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

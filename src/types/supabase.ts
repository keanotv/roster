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
      answers: {
        Row: {
          answer: string
          created_at: string
          id: number
          vg: string
        }
        Insert: {
          answer?: string
          created_at?: string
          id?: number
          vg?: string
        }
        Update: {
          answer?: string
          created_at?: string
          id?: number
          vg?: string
        }
        Relationships: []
      }
      authorized_users: {
        Row: {
          telegram_id: string
        }
        Insert: {
          telegram_id: string
        }
        Update: {
          telegram_id?: string
        }
        Relationships: []
      }
      countdown: {
        Row: {
          durations: string
          end: string
          id: number
          reveal: boolean
          started: boolean
          time: string
          video: boolean
        }
        Insert: {
          durations?: string
          end: string
          id?: number
          reveal: boolean
          started: boolean
          time?: string
          video: boolean
        }
        Update: {
          durations?: string
          end?: string
          id?: number
          reveal?: boolean
          started?: boolean
          time?: string
          video?: boolean
        }
        Relationships: []
      }
      masterclass: {
        Row: {
          id: number
          votes: number
        }
        Insert: {
          id?: number
          votes?: number
        }
        Update: {
          id?: number
          votes?: number
        }
        Relationships: []
      }
      settings: {
        Row: {
          bot_notifications: boolean | null
          light_mode_default: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          bot_notifications?: boolean | null
          light_mode_default?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          bot_notifications?: boolean | null
          light_mode_default?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      submissions: {
        Row: {
          category: string | null
          cluster: string | null
          created_at: string
          id: number
          text: string | null
        }
        Insert: {
          category?: string | null
          cluster?: string | null
          created_at?: string
          id?: number
          text?: string | null
        }
        Update: {
          category?: string | null
          cluster?: string | null
          created_at?: string
          id?: number
          text?: string | null
        }
        Relationships: []
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

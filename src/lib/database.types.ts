export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      attachments: {
        Row: {
          id: string
          filename: string
          size: number
          mime_type: string
          uploaded_at: string
          uploaded_by: string
          virus_scanned: boolean
          url: string | null
          request_id: string
          created_at: string
        }
        Insert: {
          id?: string
          filename: string
          size: number
          mime_type: string
          uploaded_at?: string
          uploaded_by: string
          virus_scanned?: boolean
          url?: string | null
          request_id: string
          created_at?: string
        }
        Update: {
          id?: string
          filename?: string
          size?: number
          mime_type?: string
          uploaded_at?: string
          uploaded_by?: string
          virus_scanned?: boolean
          url?: string | null
          request_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "attachments_request_id_fkey"
            columns: ["request_id"]
            referencedRelation: "workflow_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attachments_uploaded_by_fkey"
            columns: ["uploaded_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      audit_events: {
        Row: {
          id: string
          timestamp: string
          user_id: string | null
          action: string
          object_type: string
          object_id: string | null
          old_value: Json | null
          new_value: Json | null
          reason: string | null
          ip_address: string | null
          user_agent: string | null
        }
        Insert: {
          id?: string
          timestamp?: string
          user_id?: string | null
          action: string
          object_type: string
          object_id?: string | null
          old_value?: Json | null
          new_value?: Json | null
          reason?: string | null
          ip_address?: string | null
          user_agent?: string | null
        }
        Update: {
          id?: string
          timestamp?: string
          user_id?: string | null
          action?: string
          object_type?: string
          object_id?: string | null
          old_value?: Json | null
          new_value?: Json | null
          reason?: string | null
          ip_address?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_events_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      batch_lot_numbers: {
        Row: {
          id: string
          batch_number: string
          lot_number: string | null
          product_code: string | null
          manufacturing_date: string | null
          expiry_date: string | null
          quantity: number | null
          unit: string | null
          status: string | null
          release_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          batch_number: string
          lot_number?: string | null
          product_code?: string | null
          manufacturing_date?: string | null
          expiry_date?: string | null
          quantity?: number | null
          unit?: string | null
          status?: string | null
          release_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          batch_number?: string
          lot_number?: string | null
          product_code?: string | null
          manufacturing_date?: string | null
          expiry_date?: string | null
          quantity?: number | null
          unit?: string | null
          status?: string | null
          release_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "batch_lot_numbers_product_code_fkey"
            columns: ["product_code"]
            referencedRelation: "product_codes"
            referencedColumns: ["code"]
          }
        ]
      }
      equipment: {
        Row: {
          id: string
          name: string
          type: string | null
          model: string | null
          manufacturer: string | null
          serial_number: string | null
          location: string | null
          status: string | null
          calibration_due: string | null
          qualification_status: string | null
          last_qualified: string | null
          next_qualification: string | null
          specifications: Json | null
          documents: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type?: string | null
          model?: string | null
          manufacturer?: string | null
          serial_number?: string | null
          location?: string | null
          status?: string | null
          calibration_due?: string | null
          qualification_status?: string | null
          last_qualified?: string | null
          next_qualification?: string | null
          specifications?: Json | null
          documents?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: string | null
          model?: string | null
          manufacturer?: string | null
          serial_number?: string | null
          location?: string | null
          status?: string | null
          calibration_due?: string | null
          qualification_status?: string | null
          last_qualified?: string | null
          next_qualification?: string | null
          specifications?: Json | null
          documents?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      permissions: {
        Row: {
          id: string
          name: string
          resource: string
          action: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          resource: string
          action: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          resource?: string
          action?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      product_codes: {
        Row: {
          id: string
          code: string
          name: string
          description: string | null
          category: string | null
          strength: string | null
          unit: string | null
          active_ingredients: string[] | null
          regulatory_status: string | null
          specifications: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          name: string
          description?: string | null
          category?: string | null
          strength?: string | null
          unit?: string | null
          active_ingredients?: string[] | null
          regulatory_status?: string | null
          specifications?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          name?: string
          description?: string | null
          category?: string | null
          strength?: string | null
          unit?: string | null
          active_ingredients?: string[] | null
          regulatory_status?: string | null
          specifications?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          id: string
          role_id: string
          permission_id: string
          created_at: string
        }
        Insert: {
          id?: string
          role_id: string
          permission_id: string
          created_at?: string
        }
        Update: {
          id?: string
          role_id?: string
          permission_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            referencedRelation: "roles"
            referencedColumns: ["id"]
          }
        ]
      }
      roles: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      test_results: {
        Row: {
          id: string
          batch_id: string | null
          test_type: string
          result: string | null
          specification: string | null
          status: string | null
          tested_by: string | null
          tested_at: string
          equipment_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          batch_id?: string | null
          test_type: string
          result?: string | null
          specification?: string | null
          status?: string | null
          tested_by?: string | null
          tested_at?: string
          equipment_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          batch_id?: string | null
          test_type?: string
          result?: string | null
          specification?: string | null
          status?: string | null
          tested_by?: string | null
          tested_at?: string
          equipment_id?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_results_batch_id_fkey"
            columns: ["batch_id"]
            referencedRelation: "batch_lot_numbers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_results_equipment_id_fkey"
            columns: ["equipment_id"]
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_results_tested_by_fkey"
            columns: ["tested_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          id: string
          email: string
          first_name: string
          last_name: string
          role_id: string | null
          department: string | null
          organization_id: string | null
          is_active: boolean | null
          last_login: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          first_name: string
          last_name: string
          role_id?: string | null
          department?: string | null
          organization_id?: string | null
          is_active?: boolean | null
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string
          last_name?: string
          role_id?: string | null
          department?: string | null
          organization_id?: string | null
          is_active?: boolean | null
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_role_id_fkey"
            columns: ["role_id"]
            referencedRelation: "roles"
            referencedColumns: ["id"]
          }
        ]
      }
      workflow_executions: {
        Row: {
          id: string
          workflow_id: string | null
          status: string
          current_node_id: string | null
          started_at: string
          completed_at: string | null
          executed_by: string | null
          context: Json | null
          history: Json | null
        }
        Insert: {
          id?: string
          workflow_id?: string | null
          status: string
          current_node_id?: string | null
          started_at?: string
          completed_at?: string | null
          executed_by?: string | null
          context?: Json | null
          history?: Json | null
        }
        Update: {
          id?: string
          workflow_id?: string | null
          status?: string
          current_node_id?: string | null
          started_at?: string
          completed_at?: string | null
          executed_by?: string | null
          context?: Json | null
          history?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "workflow_executions_executed_by_fkey"
            columns: ["executed_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_executions_workflow_id_fkey"
            columns: ["workflow_id"]
            referencedRelation: "workflow_templates"
            referencedColumns: ["id"]
          }
        ]
      }
      workflow_requests: {
        Row: {
          id: string
          title: string
          description: string | null
          type_id: string | null
          status: string
          priority: string
          submitted_by: string | null
          submitted_at: string
          assigned_to: string | null
          due_date: string | null
          completed_at: string | null
          form_data: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          type_id?: string | null
          status: string
          priority: string
          submitted_by?: string | null
          submitted_at?: string
          assigned_to?: string | null
          due_date?: string | null
          completed_at?: string | null
          form_data?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          type_id?: string | null
          status?: string
          priority?: string
          submitted_by?: string | null
          submitted_at?: string
          assigned_to?: string | null
          due_date?: string | null
          completed_at?: string | null
          form_data?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_requests_assigned_to_fkey"
            columns: ["assigned_to"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_requests_submitted_by_fkey"
            columns: ["submitted_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_requests_type_id_fkey"
            columns: ["type_id"]
            referencedRelation: "workflow_types"
            referencedColumns: ["id"]
          }
        ]
      }
      workflow_templates: {
        Row: {
          id: string
          name: string
          description: string | null
          category: string
          nodes: Json
          connections: Json
          version: string
          created_by: string | null
          created_at: string
          updated_at: string
          is_published: boolean | null
          compliance_level: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          category: string
          nodes?: Json
          connections?: Json
          version: string
          created_by?: string | null
          created_at?: string
          updated_at?: string
          is_published?: boolean | null
          compliance_level?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          category?: string
          nodes?: Json
          connections?: Json
          version?: string
          created_by?: string | null
          created_at?: string
          updated_at?: string
          is_published?: boolean | null
          compliance_level?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workflow_templates_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      workflow_types: {
        Row: {
          id: string
          name: string
          category: string
          description: string | null
          form_schema: Json
          approval_required: boolean | null
          estimated_duration: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          description?: string | null
          form_schema: Json
          approval_required?: boolean | null
          estimated_duration?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          description?: string | null
          form_schema?: Json
          approval_required?: boolean | null
          estimated_duration?: number | null
          created_at?: string
          updated_at?: string
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
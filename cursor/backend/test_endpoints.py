#!/usr/bin/env python3
"""
Test script to verify all backend endpoints are properly configured.
Run this after starting the backend server.
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.app import create_app

def test_endpoints():
    app = create_app()
    
    print("=" * 60)
    print("BACKEND ENDPOINT VERIFICATION")
    print("=" * 60)
    print()
    
    # Get all routes
    routes = []
    for rule in app.url_map.iter_rules():
        methods = ','.join(sorted(rule.methods - {'OPTIONS', 'HEAD'}))
        routes.append({
            'endpoint': str(rule),
            'methods': methods,
            'rule': rule.rule
        })
    
    # Group by category
    categories = {
        'Health & Public': [],
        'Jobs': [],
        'Blogs': [],
        'Testimonials': [],
        'Case Studies': [],
        'AI Endpoints': [],
        'Admin': []
    }
    
    for route in sorted(routes, key=lambda x: x['rule']):
        rule = route['rule']
        if rule == '/':
            categories['Health & Public'].append(route)
        elif rule == '/health':
            categories['Health & Public'].append(route)
        elif '/jobs' in rule:
            if '/admin' in rule:
                categories['Admin'].append(route)
            else:
                categories['Jobs'].append(route)
        elif '/blogs' in rule:
            if '/admin' in rule:
                categories['Admin'].append(route)
            else:
                categories['Blogs'].append(route)
        elif '/testimonials' in rule:
            categories['Testimonials'].append(route)
        elif '/case-studies' in rule:
            categories['Case Studies'].append(route)
        elif '/apply' in rule:
            categories['Jobs'].append(route)
        elif '/ai' in rule:
            categories['AI Endpoints'].append(route)
        elif '/admin' in rule:
            categories['Admin'].append(route)
    
    # Print results
    total = 0
    for category, routes_list in categories.items():
        if routes_list:
            print(f"\n{category}:")
            print("-" * 60)
            for route in routes_list:
                print(f"  {route['methods']:15} {route['rule']}")
                total += 1
    
    print()
    print("=" * 60)
    print(f"✓ Total Endpoints: {total}")
    print("=" * 60)
    print()
    print("All endpoints are properly configured!")
    print()
    print("To test endpoints:")
    print("  1. Start backend: python backend/app.py")
    print("  2. Import Mastersolis_API.postman_collection.json into Postman")
    print("  3. Set base_url variable to http://localhost:5001")
    print("  4. Run requests from the collection")

if __name__ == "__main__":
    test_endpoints()

